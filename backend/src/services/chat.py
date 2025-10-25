"""
Chat Service
Handles natural language Q&A about contracts using RAG + Gemini.

- Per-contract and cross-contract questions
- Retrieves top-k chunks via rag_service
- Answers strictly from provided context
- Returns citations with chunk_id, page, and short snippet
"""

from typing import Dict, List, Optional, Any
import json

import google.generativeai as genai
from src.config.settings import get_settings
from src.services.rag import rag_service

settings = get_settings()


SYSTEM_QA_INSTRUCTIONS = (
    "You are an AI contract analyst. Answer the user's question STRICTLY from the provided CHUNKS. "
    "If the answer is not present in the chunks, say you cannot find it in the contract text. "
    "Return ONLY JSON with keys: answer (string), citations (list of {chunk_id, page, text}), confidence (0..1). "
    "Citations should quote only the minimum necessary snippet supporting the answer."
)

def _cap_snippet(s: str, n: int = 260) -> str:
    s = (s or "").strip().replace("\n", " ")
    return s if len(s) <= n else s[: n - 1] + "…"


class ChatService:
    """
    Service for handling natural language questions about contracts.
    """

    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-pro",
                generation_config={"response_mime_type": "application/json"},
            )
        else:
            self.model = None

    async def answer_question(
        self,
        question: str,
        contract_id: Optional[str] = None,
        contract_text: Optional[str] = None,  
        context: Optional[Dict] = None
    ) -> Dict:
        """
        Generic entrypoint. If contract_id is provided, search only that contract;
        otherwise do a global search across all indexed contracts.
        """
        if not self.model:
            return {
                "answer": "Chat service is not configured. Please add GEMINI_API_KEY to .env file.",
                "sources": [],
                "confidence": 0.0,
            }

        # 1) Retrieve relevant chunks via RAG
        if contract_id:
            hits = await rag_service.search_contract(str(contract_id), question, top_k=6)
        else:
            hits = await rag_service.search_all_contracts(question, top_k=8)

        if not hits:
            if contract_text and contract_text.strip():
                temp_chunks = rag_service.chunk_text(contract_text)[:6]
                chunks_payload = [
                    {"chunk_id": c.get("chunk_id", f"temp_{i}"), "page": c.get("page", 0), "text": c["text"]}
                    for i, c in enumerate(temp_chunks)
                ]
            else:
                return {
                    "answer": "I couldn’t find relevant context to answer from the contract(s).",
                    "sources": [],
                    "confidence": 0.0,
                }
        else:
            chunks_payload = [
                {
                    "chunk_id": h["chunk_id"],
                    "page": h.get("page", 0),
                    "text": h["text"],
                    "score": h.get("score", 0.0),
                }
                for h in hits
            ]

        payload = {
            "question": question,
            "chunks": [
                {
                    "chunk_id": c["chunk_id"],
                    "page": c.get("page", 0),
                    "text": c["text"],
                }
                for c in chunks_payload
            ],
        }

        try:
            prompt_parts = [
                {"text": SYSTEM_QA_INSTRUCTIONS},
                {"text": json.dumps(payload, ensure_ascii=False)},
            ]
            resp = self.model.generate_content(contents=[{"role": "user", "parts": prompt_parts}])
            data = json.loads(resp.text)

            answer = data.get("answer") or "I couldn’t find that in the provided context."
            citations = data.get("citations") or []
            confidence = float(data.get("confidence", 0.5))

            sources = self.format_sources([
                f"{c.get('chunk_id','')} p.{c.get('page',0)}: {_cap_snippet(c.get('text',''))}"
                for c in citations
            ])

            return {
                "answer": answer,
                "sources": sources,
                "confidence": max(0.0, min(1.0, confidence)),
            }

        except Exception as e:
            fallbacks = [
                f"{c['chunk_id']} p.{c.get('page',0)}: {_cap_snippet(c['text'])}"
                for c in chunks_payload[:3]
            ]
            return {
                "answer": "I had trouble generating an answer from the context. Here are the most relevant excerpts.",
                "sources": self.format_sources(fallbacks),
                "confidence": 0.0,
            }

    async def answer_contract_question(
        self,
        question: str,
        contract_id: str,
        previous_messages: Optional[List[Dict]] = None
    ) -> Dict:
        """
        Contract-scoped Q&A. Delegates to answer_question with contract_id.
        """
        return await self.answer_question(question=question, contract_id=contract_id)

    async def answer_general_question(
        self,
        question: str,
        user_id: str,
        previous_messages: Optional[List[Dict]] = None
    ) -> Dict:
        """
        Portfolio-wide Q&A. Uses global search across all indexed contracts.
        """
        return await self.answer_question(question=question, contract_id=None)

    async def get_conversation_context(
        self,
        user_id: str,
        contract_id: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Stub for conversation history. Integrate with your DB/chat_history if needed.
        """
        return []

    def format_sources(self, sources: List[str]) -> List[str]:
        """
        Simple pass-through for now. You can format for UI (truncate, add icons, etc.).
        """
        return sources

chat_service = ChatService()