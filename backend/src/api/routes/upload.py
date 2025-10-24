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
# Import the new service modules
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
    Upload a contract file (PDF or DOCX).
    
    Process flow:
    1. Validate and save file
    2. Extract text using OCR service (ocr_service.py)
    3. Extract data using extraction service (extraction.py)
    4. Analyze risks using risk service (risks.py)
    5. Generate summary using summary service (summary.py)
    6. Index in RAG for chat (rag.py)
    
    TODO: Backend team needs to implement the services and connect them here
    """
    # Validate file type
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX are allowed.")
    
    # Determine file type
    file_type = FileType.pdf if file.content_type == "application/pdf" else FileType.docx
    
    # Generate unique filename
    file_extension = ".pdf" if file_type == FileType.pdf else ".docx"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Create contract record
    contract = Contract(
        title=file.filename.replace(file_extension, ""),
        file_name=file.filename,
        file_path=file_path,
        file_type=file_type,
        uploaded_by=current_user.id,
        status=ContractStatus.pending
    )
    
    db.add(contract)
    await db.commit()
    await db.refresh(contract)
    
    # TODO: Backend team - Implement the following pipeline:
    # 
    # Step 1: Extract text from file
    # if file_type == FileType.pdf:
    #     text = await OCRService.extract_text_from_pdf(file_path)
    # else:
    #     text = await OCRService.extract_text_from_docx(file_path)
    #
    # Step 2: Extract structured data
    # extracted_data = await extraction_service.extract_all(text)
    # # Save parties, dates, financial_terms to database
    #
    # Step 3: Analyze risks
    # risks = await risk_service.analyze_risks(text, extracted_data)
    # # Save risks to database
    #
    # Step 4: Generate summary
    # summary_data = await summary_service.generate_summary(text, extracted_data, risks)
    # # Update contract with summary, purpose, scope
    #
    # Step 5: Index for RAG
    # await rag_service.index_contract(contract.id, text)
    #
    # Step 6: Update contract status to 'completed'
    # contract.status = ContractStatus.completed
    # await db.commit()
    
    return {
        "contract_id": contract.id,
        "file_name": file.filename,
        "status": contract.status.value,
        "message": "Contract uploaded successfully. Backend team needs to implement AI analysis pipeline."
    }
