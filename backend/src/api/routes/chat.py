from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import Optional, List

from src.config.database import get_db
from src.models.chat_history import ChatHistory
from src.services.chat import chat_service

router = APIRouter()

async def _load_previous_messages(
    db: AsyncSession,
    contract_id: Optional[str],
    limit: int = 10,
) -> List[dict]:
    """
    Fetch recent chat history (no user filter, auth disabled for testing).
    """
    stmt = select(ChatHistory).order_by(desc(ChatHistory.timestamp)).limit(limit)
    if contract_id:
        stmt = (
            select(ChatHistory)
            .where(ChatHistory.contract_id == contract_id)
            .order_by(desc(ChatHistory.timestamp))
            .limit(limit)
        )

    rows = (await db.execute(stmt)).scalars().all()
    history = [
        {
            "message": r.message,
            "response": r.response,
            "contract_id": r.contract_id,
            "timestamp": getattr(r, "timestamp", None),
        }
        for r in reversed(rows)  # oldest -> newest
    ]
    return history


@router.post("")
async def ask_question(
    message: str,
    contract_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Contract-scoped or global Q&A (auth disabled for testing).
    """
    if not message or not message.strip():
        raise HTTPException(status_code=400, detail="Message must not be empty.")

    previous_messages = await _load_previous_messages(
        db=db,
        contract_id=contract_id,
        limit=10,
    )

    if contract_id:
        result = await chat_service.answer_contract_question(
            question=message,
            contract_id=str(contract_id),
            previous_messages=previous_messages,
        )
    else:
        # When auth is disabled, pass a dummy user id
        result = await chat_service.answer_general_question(
            question=message,
            user_id="public-test",
            previous_messages=previous_messages,
        )

    ai_response = result.get("answer", "I couldn't generate a response.")
    sources = result.get("sources", [])
    confidence = float(result.get("confidence", 0.0))

    record = ChatHistory(
        contract_id=contract_id,
        user_id="public-test",  # was current_user.id
        message=message,
        response=ai_response,
    )
    db.add(record)
    await db.commit()

    return {
        "response": ai_response,
        "sources": sources,
        "confidence": confidence,
    }


@router.get("/history")
async def get_chat_history(
    contract_id: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """
    Return recent chat history (auth disabled for testing).
    """
    limit = max(1, min(limit, 200))

    stmt = select(ChatHistory).order_by(desc(ChatHistory.timestamp)).limit(limit)
    if contract_id:
        stmt = (
            select(ChatHistory)
            .where(ChatHistory.contract_id == contract_id)
            .order_by(desc(ChatHistory.timestamp))
            .limit(limit)
        )

    rows = (await db.execute(stmt)).scalars().all()
    history = [
        {
            "id": getattr(r, "id", None),
            "contract_id": r.contract_id,
            "message": r.message,
            "response": r.response,
            "timestamp": getattr(r, "timestamp", None),
        }
        for r in rows
    ]

    return {"history": list(reversed(history)), "count": len(history)}
