from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from src.config.database import get_db
from src.models.user import User
from src.models.chat_history import ChatHistory
from src.api.routes.auth import get_current_user
# Import the new chat service
from src.services.chat import chat_service

router = APIRouter()

@router.post("")
async def ask_question(
    message: str,
    contract_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ask a question about a contract or contracts in general.
    
    Uses the chat service (chat.py) which leverages RAG (rag.py) for context retrieval.
    
    TODO: Backend team needs to implement chat_service methods
    """
    
    # TODO: Backend team - Use the chat service:
    #
    # if contract_id:
    #     # Question about specific contract
    #     result = await chat_service.answer_contract_question(
    #         question=message,
    #         contract_id=contract_id,
    #         previous_messages=[]  # TODO: Load from database
    #     )
    # else:
    #     # General question about all contracts
    #     result = await chat_service.answer_general_question(
    #         question=message,
    #         user_id=current_user.id,
    #         previous_messages=[]
    #     )
    #
    # ai_response = result['answer']
    # sources = result['sources']
    
    # Placeholder response until chat service is implemented
    ai_response = f"Placeholder: '{message}'. Backend team needs to implement chat_service.answer_question() in services/chat.py"
    sources = []
    
    # Save to chat history
    chat_record = ChatHistory(
        contract_id=contract_id,
        user_id=current_user.id,
        message=message,
        response=ai_response
    )
    
    db.add(chat_record)
    await db.commit()
    
    return {
        "response": ai_response,
        "sources": sources
    }

@router.get("/history")
async def get_chat_history(
    contract_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get chat history for a user or specific contract.
    TODO: Backend team needs to implement pagination.
    """
    # TODO: Implement actual query
    return {
        "history": [],
        "message": "Chat history endpoint - to be implemented by backend team"
    }
