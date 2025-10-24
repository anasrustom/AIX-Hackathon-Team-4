"""
Extraction Service
Handles extracting key information from contract documents.

Backend team should implement:
- Extract contracting parties (names, types, roles)
- Extract key dates (effective date, expiration, renewal, etc.)
- Extract financial terms (amounts, payment schedules, penalties)
- Extract governing law and jurisdiction
- Extract contract type and industry classification
- Extract key obligations and deliverables

This service will be called after OCR/text extraction is complete.
"""

from typing import Dict, List, Optional
import google.generativeai as genai
from src.config.settings import get_settings

settings = get_settings()


class ExtractionService:
    """
    Service for extracting structured data from contract text using AI.
    """
    
    def __init__(self):
        """
        Initialize the extraction service with Gemini AI.
        TODO: Backend team - configure Gemini API
        """
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    async def extract_all(self, contract_text: str) -> Dict:
        """
        Extract all key information from contract text.
        
        Args:
            contract_text: The full text of the contract
            
        Returns:
            dict: Structured data containing:
                - parties: List[Dict] - Contracting parties
                - key_dates: List[Dict] - Important dates
                - financial_terms: List[Dict] - Financial information
                - governing_law: str - Governing law
                - jurisdiction: str - Jurisdiction
                - industry: str - Industry classification
                - contract_type: str - Type of contract
                - tags: List[str] - Contract tags
                
        TODO: Backend team - Implement extraction logic using Gemini
        """
        if not self.model:
            return {
                "error": "Gemini API not configured",
                "parties": [],
                "key_dates": [],
                "financial_terms": [],
                "governing_law": None,
                "jurisdiction": None,
                "industry": None,
                "contract_type": None,
                "tags": []
            }
        
        # TODO: Implement actual extraction
        # Suggested approach:
        # 1. Use Gemini with structured prompts for each data type
        # 2. Parse and validate the AI responses
        # 3. Return structured data
        
        return {
            "parties": [],  # TODO: Extract parties
            "key_dates": [],  # TODO: Extract dates
            "financial_terms": [],  # TODO: Extract financial terms
            "governing_law": None,  # TODO: Extract governing law
            "jurisdiction": None,  # TODO: Extract jurisdiction
            "industry": None,  # TODO: Classify industry
            "contract_type": None,  # TODO: Determine contract type
            "tags": []  # TODO: Generate tags
        }
    
    async def extract_parties(self, contract_text: str) -> List[Dict]:
        """
        Extract contracting parties from the contract.
        
        Returns:
            List of dicts with keys: name, type (individual/organization), role (client/vendor/partner/other)
            
        TODO: Backend team - Implement party extraction
        """
        # TODO: Use Gemini to extract party information
        return []
    
    async def extract_dates(self, contract_text: str) -> List[Dict]:
        """
        Extract key dates from the contract.
        
        Returns:
            List of dicts with keys: date_type, date, description
            
        TODO: Backend team - Implement date extraction
        """
        # TODO: Use Gemini to extract dates
        return []
    
    async def extract_financial_terms(self, contract_text: str) -> List[Dict]:
        """
        Extract financial terms from the contract.
        
        Returns:
            List of dicts with keys: term_type, amount, currency, schedule, description
            
        TODO: Backend team - Implement financial term extraction
        """
        # TODO: Use Gemini to extract financial terms
        return []
    
    async def extract_governing_law(self, contract_text: str) -> Optional[str]:
        """
        Extract the governing law from the contract.
        
        TODO: Backend team - Implement governing law extraction
        """
        # TODO: Use Gemini to extract governing law
        return None
    
    async def extract_jurisdiction(self, contract_text: str) -> Optional[str]:
        """
        Extract the jurisdiction from the contract.
        
        TODO: Backend team - Implement jurisdiction extraction
        """
        # TODO: Use Gemini to extract jurisdiction
        return None


# Singleton instance
extraction_service = ExtractionService()
