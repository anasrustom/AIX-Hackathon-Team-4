import os
from typing import Dict, Any
from io import BytesIO

from pdfminer.high_level import extract_text
from pypdf import PdfReader
from docx import Document
from langdetect import detect

from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams
from io import StringIO

from src.utils.text import normalize_ar_digits, strip_tatweel, clean_spaces
from src.utils.text import strip_long_underscores
class OCRService:

    @staticmethod
    async def extract_text_from_pdf(file_path: str) -> Dict[str, Any]:
        """
        Extract text from a PDF. If text layer missing (scanned PDF),
        fallback to OCR service (future extension: Azure / Doctr).
        Returns: { text: str, pages: int, language: str, page_offsets: List[int] }
        page_offsets[i] = starting character offset of page i within the normalized full text.
        """
        try:
            # Count pages with pypdf
            with open(file_path, "rb") as f:
                reader = PdfReader(f)
                pages = len(reader.pages)

            # Per-page extraction with pdfminer to compute page_offsets
            page_texts = []
            for i in range(pages):
                buf = StringIO()
                with open(file_path, "rb") as f2:
                    extract_text_to_fp(f2, buf, laparams=LAParams(), page_numbers=[i])
                page_texts.append(buf.getvalue() or "")

            # Normalize each page then join to single text
            norm_pages = [OCRService._preprocess_text(t) for t in page_texts]
            text = "".join(norm_pages) or ""

            # Fallback to whole-file text if result is too small (handles odd PDFs)
            if len(text.strip()) < 50:
                text = extract_text(file_path) or ""
                if len(text.strip()) < 50:
                    text = await OCRService._fallback_ocr_pdf(file_path)
                text = OCRService._preprocess_text(text)
                # If we didn’t build page-wise text, just return no offsets
                page_offsets = []
            else:
                # Build page_offsets over normalized pages
                page_offsets = []
                acc = 0
                for pt in norm_pages:
                    page_offsets.append(acc)
                    acc += len(pt)

            language = OCRService._detect_language(text)

            return {
                "text": text,
                "pages": pages,
                "language": language,
                "page_offsets": page_offsets,  # may be [] if unknown
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
            text = strip_long_underscores(text)
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