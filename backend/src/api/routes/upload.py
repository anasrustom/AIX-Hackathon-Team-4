from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import os
import uuid
from datetime import datetime

from src.config.database import get_db
from src.config.settings import get_settings
from src.models.contract import Contract, FileType, ContractStatus
from src.models.user import User
from src.api.routes.auth import get_current_user

from src.services.ocr_service import OCRService
from src.services.extraction import extraction_service
from src.services.risks import risk_service
from src.services.summary import summary_service
from src.services.rag import rag_service

router = APIRouter()
settings = get_settings()

@router.post("/upload")
async def upload_contract(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a contract file (PDF or DOCX) and run the AI analysis pipeline.
    Flow:
    1) Save file
    2) OCR/parse -> text, pages, language
    3) Extraction (structured fields)
    4) Risk analysis
    5) Summary
    6) RAG indexing
    7) Persist minimal contract status; return analysis payload
    """
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX are allowed.")

    file_type = FileType.pdf if file.content_type == "application/pdf" else FileType.docx
    ext = ".pdf" if file_type == FileType.pdf else ".docx"
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(settings.upload_dir, unique_name)

    os.makedirs(settings.upload_dir, exist_ok=True)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    contract = Contract(
        title=os.path.splitext(file.filename)[0],
        file_name=file.filename,
        file_path=file_path,
        file_type=file_type,
        uploaded_by=current_user.id,
        status=ContractStatus.pending,
    )
    db.add(contract)
    await db.commit()
    await db.refresh(contract)

    try:
        if file_type == FileType.pdf:
            parsed = await OCRService.extract_text_from_pdf(file_path)
        else:
            parsed = await OCRService.extract_text_from_docx(file_path)

        text = parsed.get("text", "") or ""
        pages = int(parsed.get("pages", 0) or 0)
        language = parsed.get("language", "en")

        if not text.strip():
            raise HTTPException(status_code=422, detail="Unable to extract text from the uploaded file.")

        extracted = await extraction_service.extract_all(
            doc_id=str(contract.id),
            text=text,
            language=language
        )

        risks = await risk_service.analyze_risks(
            doc_id=str(contract.id),
            text=text,
            language=language,
            extracted=extracted
        )

        summary = await summary_service.generate_summary(
            text=text,
            extracted=extracted,
            risks=risks
        )

        await rag_service.index_contract(
            contract_id=contract.id,
            text=text,
            language=language
        )

        contract.status = ContractStatus.completed
        await db.commit()
        await db.refresh(contract)

        return {
            "contract_id": contract.id,
            "file_name": contract.file_name,
            "status": contract.status.value,
            "pages": pages,
            "language": language,
            "message": "Contract analyzed successfully.",
            "analysis": {
                "extracted": extracted,
                "risks": risks,
                "summary": summary
            }
        }

    except HTTPException:
        contract.status = ContractStatus.failed
        await db.commit()
        raise

    except Exception as e:
        contract.status = ContractStatus.failed
        await db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {type(e).__name__}: {str(e)}")
