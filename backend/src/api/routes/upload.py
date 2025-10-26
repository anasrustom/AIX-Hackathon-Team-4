from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import os, uuid

from src.config.database import get_db
from src.config.settings import get_settings
from src.models.contract import Contract, FileType, ContractStatus

from src.api.routes.auth import get_current_user 
from src.models.user import User  

from src.services.ocr_service import OCRService
from src.services.rag import rag_service
from src.services.analyze import analyze_service

router = APIRouter()
settings = get_settings()

@router.post("/upload")
async def upload_contract(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),  
):
    """
    Upload a contract (PDF/DOCX) and run the AI analysis pipeline in ONE LLM call.
    Required auth: Bearer Token → assigns actual user ID to uploaded_by.
    """
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream"
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
        uploaded_by=str(current_user.id),  
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
        page_offsets = parsed.get("page_offsets")

        if not text.strip():
            raise HTTPException(status_code=422, detail="Unable to extract text from file")

        await rag_service.index_contract(
            contract_id=str(contract.id),
            text=text,
            language=language,
            page_offsets=page_offsets,
        )

        combined = await analyze_service.analyze(contract_id=str(contract.id))

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
            "analysis": combined,
        }

    except HTTPException:
        contract.status = ContractStatus.failed
        await db.commit()
        raise

    except Exception as e:
        contract.status = ContractStatus.failed
        await db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {type(e).__name__}: {str(e)}")