import os
from typing import Dict, Any
from io import BytesIO

from pdfminer.high_level import extract_text
from pypdf import PdfReader
from docx import Document
from langdetect import detect

from src.utils.text import normalize_ar_digits, strip_tatweel, clean_spaces

class OCRService:

    @staticmethod
    async def extract_text_from_pdf(file_path: str) -> Dict[str, Any]:
        """
        Extract text from a PDF. If text layer missing (scanned PDF),
        fallback to OCR service (future extension: Azure / Doctr).
        Returns: { text: str, pages: int, language: str }
        """
        try:
            text = ""
            pages = 0

            with open(file_path, "rb") as file:
                reader = PdfReader(file)
                pages = len(reader.pages)

            text = extract_text(file_path) or ""

            if len(text.strip()) < 50:
                text = await OCRService._fallback_ocr_pdf(file_path)

            text = OCRService._preprocess_text(text)

            language = OCRService._detect_language(text)

            return {
                "text": text,
                "pages": pages,
                "language": language
            }

        except Exception as e:
            raise Exception(f"PDF extraction error: {str(e)}")

    @staticmethod
    async def extract_text_from_docx(file_path: str) -> Dict[str, Any]:
        """
        Extract from a DOCX.
        Returns: { text: str, pages: int (est), language: str }
        """
        try:
            doc = Document(file_path)
            text = " ".join([p.text for p in doc.paragraphs])
            text = OCRService._preprocess_text(text)

            pages = max(1, len(text) // 2000)

            language = OCRService._detect_language(text)

            return {
                "text": text,
                "pages": pages,
                "language": language
            }

        except Exception as e:
            raise Exception(f"DOCX extraction error: {str(e)}")

    # ---------------- INTERNAL HELPERS ---------------- #

    @staticmethod
    async def _fallback_ocr_pdf(file_path: str) -> str:
        """
        Future OCR fallback logic (Azure Document Intelligence or Doctr).
        Currently returns empty string until OCR added.
        """
        # TODO: implement OCR fallback → integrate with ocr_service.py using Doctr or Azure
        return ""

    @staticmethod
    def _preprocess_text(text: str) -> str:
        """
        Cleanup for LLM/RAG: remove extra whitespace, normalize Arabic digits, strip tatweel
        """
        try:
            text = normalize_ar_digits(text)
            text = strip_tatweel(text)
            text = clean_spaces(text)
        except Exception:
            pass
        return text

    @staticmethod
    def _detect_language(text: str) -> str:
        """
        Basic lang detection (English/Arabic). Extend if needed.
        """
        try:
            lang = detect(text)
            return "ar" if lang.startswith("ar") else "en"
        except Exception:
            return "en"