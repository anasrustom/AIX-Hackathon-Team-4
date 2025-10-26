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
    "Citations must include a valid chunk_id from the input. Keep snippets minimal."
)

def _cap_snippet(s: str, n: int = 260) -> str:
    s = (s or "").strip().replace("\n", " ")
    return s if len(s) <= n else s[: n - 1] + "…"


class ChatService:
    """
    Service for handling natural language questions about contracts.
    """

    # Guardrail bounds
    _MAX_CITATIONS = 5
    _MAX_OUTPUT_TOKENS = 768

    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                generation_config={
                    "response_mime_type": "application/json",
                    "max_output_tokens": self._MAX_OUTPUT_TOKENS,
                },
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
            hits = await rag_service.search_contract(str(contract_id), question, top_k=8)
        else:
            hits = await rag_service.search_all_contracts(question, top_k=10)

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

            # Guardrail: validate citations come back with valid chunk_ids
            citations = self._filter_citations(
                proposed=data.get("citations"),
                allowed_chunk_ids={c["chunk_id"] for c in chunks_payload},
                max_items=self._MAX_CITATIONS,
            )

            # If model returned no valid citations, fall back to top chunks as sources
            if not citations:
                fallback = [
                    f"{c['chunk_id']} p.{c.get('page',0)}: {_cap_snippet(c['text'])}"
                    for c in chunks_payload[: min(3, len(chunks_payload))]
                ]
                return {
                    "answer": data.get("answer") or "I had trouble generating an answer from the context.",
                    "sources": self.format_sources(fallback),
                    "confidence": float(data.get("confidence", 0.0)),
                }

            # Build sources list from validated citations
            sources = self.format_sources([
                f"{c.get('chunk_id','')} p.{c.get('page',0)}: {_cap_snippet(c.get('text',''))}"
                for c in citations
            ])

            answer = data.get("answer") or "I couldn’t find that in the provided context."
            confidence = float(data.get("confidence", 0.5))

            return {
                "answer": answer,
                "sources": sources,
                "confidence": max(0.0, min(1.0, confidence)),
            }

        except Exception:
            # Very defensive fallback if JSON/parse fails
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

    # ---------- Internal helpers ----------

    def _filter_citations(
        self,
        proposed: Any,
        allowed_chunk_ids: set,
        max_items: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Accept only citations that include a valid chunk_id from the provided chunks.
        Cap the number returned; coerce missing fields conservatively.
        """
        out: List[Dict[str, Any]] = []
        if not isinstance(proposed, list):
            return out
        for item in proposed:
            if not isinstance(item, dict):
                continue
            cid = str(item.get("chunk_id") or "").strip()
            if not cid or cid not in allowed_chunk_ids:
                continue
            page = item.get("page", 0)
            text = item.get("text", "")
            out.append({"chunk_id": cid, "page": page, "text": text})
            if len(out) >= max_items:
                break
        return out


def _safe_int(val: Any, default: int = 768) -> int:
    try:
        ival = int(val)
        return ival if ival > 0 else default
    except Exception:
        return default
    
chat_service = ChatService()