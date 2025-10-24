# OCR and Document Processing Service
# TODO: Backend team needs to implement PDF and DOCX text extraction

import PyPDF2
from docx import Document
from typing import Optional

class OCRService:
    """
    Service for extracting text from PDF and DOCX files.
    TODO: Implement the following:
    - extract_text_from_pdf(file_path: str) -> str
    - extract_text_from_docx(file_path: str) -> str
    - preprocess_text(text: str) -> str
    """
    
    @staticmethod
    async def extract_text_from_pdf(file_path: str) -> str:
        """
        Extract text from PDF file.
        TODO: Implement PDF text extraction with proper error handling
        """
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    @staticmethod
    async def extract_text_from_docx(file_path: str) -> str:
        """
        Extract text from DOCX file.
        TODO: Implement DOCX text extraction with proper error handling
        """
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from DOCX: {str(e)}")
    
    @staticmethod
    def preprocess_text(text: str) -> str:
        """
        Clean and preprocess extracted text.
        TODO: Implement text cleaning and formatting
        """
        # Basic preprocessing
        text = text.strip()
        text = " ".join(text.split())  # Remove extra whitespace
        return text
