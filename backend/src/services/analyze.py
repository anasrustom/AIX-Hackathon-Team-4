from typing import Dict, Any, List
import json
import google.generativeai as genai

from src.config.settings import get_settings
from src.services.rag import rag_service
from src.services.extraction import EXTRACTION_SCHEMA  

settings = get_settings()

TOPICS = [
  "payment terms invoice late fees penalties",
  "limited warranty warranty disclaimer",
  "indemnity indemnification hold harmless third-party claims",
  "limitation of liability cap aggregate carve-outs",
  "confidentiality non-disclosure NDA",
  "data protection privacy GDPR PDPL breach notice security",
  "termination for cause convenience cure period",
  "governing law venue arbitration seat rules language",
  "force majeure acts of god mitigation notice",
  "intellectual property ownership license background foreground",
  "assignment subcontracting change of control"
]

SYSTEM_ANALYZE = (
  "You are an AI contract analyst. Using ONLY the provided CHUNKS, produce JSON with keys "
  "`extracted`, `risks`, and `summary` per the schemas below. Be terse and bounded. "
  "Do not speculate. Every factual point must be supported by a cited `chunk_id`."
)

SCHEMA_HINT = {
  "extracted": EXTRACTION_SCHEMA,
  "risks": {
    "type": "object",
    "properties": {
      "risks": {"type": "array", "items": {"type": "object"}},
      "non_standard": {"type": "array", "items": {"type": "object"}},
      "missing_clauses": {"type": "array", "items": {"type": "object"}},
      "overall": {"type": "object"}
    },
    "required": ["risks", "non_standard", "missing_clauses"]
  },
  "summary": {
    "type": "object",
    "properties": {
      "summary": {"type": "string", "maxLength": 2200},
      "purpose": {"type": "string"},
      "scope": {"type": "string"},
      "key_obligations": {"type": "object"},
      "highlights": {"type": "array", "items": {"type": "string"}}
    },
    "required": ["summary", "highlights"]
  }
}

BOUNDS = {
  "parties_max": 4,
  "obligations_per_party_max": 5,
  "dates_focus": ["effective_date","expiration_date","renewal_date"],
  "risks_max": 5,
  "highlight_max": 8,
  "snippet_max_chars": 220,
}

class AnalyzeService:
    def __init__(self):
      if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(
          model_name="gemini-2.5-flash",
          generation_config={
            "response_mime_type": "application/json",
            "max_output_tokens": 1024
          }
        )
      else:
        self.model = None

    async def build_evidence(self, contract_id: str) -> List[dict]:
      # RAG topic coverage (better than first N chunks)
      seen, hits = set(), []
      for t in TOPICS:
        for h in await rag_service.search_contract(contract_id, t, top_k=2):
          if h["chunk_id"] in seen:
            continue
          seen.add(h["chunk_id"])
          hits.append({"chunk_id": h["chunk_id"], "page": h.get("page", 0), "text": h["text"]})
          if len(hits) >= 24:
            return hits
      return hits

    async def analyze(self, *, contract_id: str, fallback_chunks: List[dict] = None) -> Dict[str, Any]:
      if not self.model:
        # Fallback shape if Gemini is not configured
        return {"extracted": {}, "risks": {"risks": [], "non_standard": [], "missing_clauses": []}, "summary": {"summary": "AI service not configured.", "highlights": []}}

      chunks = await self.build_evidence(contract_id)
      if not chunks and fallback_chunks:
        chunks = fallback_chunks[:20]

      payload = {
        "bounds": BOUNDS,
        "schema": SCHEMA_HINT,
        "chunks": [{"chunk_id": c["chunk_id"], "page": c.get("page",0), "text": c["text"]} for c in chunks]
      }
      prompt_parts = [{"text": SYSTEM_ANALYZE}, {"text": json.dumps(payload, ensure_ascii=False)}]

      try:
        resp = self.model.generate_content(contents=[{"role":"user","parts":prompt_parts}])
        data = json.loads(resp.text)
        return {
          "extracted": data.get("extracted", {}),
          "risks": data.get("risks", {"risks": [], "non_standard": [], "missing_clauses": []}),
          "summary": data.get("summary", {"summary": "Summary unavailable.", "highlights": []})
        }
      except Exception as e:
        return {
          "extracted": {},
          "risks": {"risks": [{"title": "LLM error", "severity":"low", "finding": str(e)}], "non_standard": [], "missing_clauses": []},
          "summary": {"summary": "Summary unavailable.", "highlights": []}
        }

analyze_service = AnalyzeService()