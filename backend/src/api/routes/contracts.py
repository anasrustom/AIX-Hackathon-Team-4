from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from typing import Optional
import json

from src.config.database import get_db
from src.models.contract import Contract
from src.models.user import User
from src.api.routes.auth import get_current_user

router = APIRouter()

@router.get("")
async def list_contracts(
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    governing_law: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all contracts with optional filters.
    TODO: Backend team needs to implement:
    1. Advanced filtering
    2. Sorting options
    3. Performance optimization for large datasets
    """
    query = select(Contract).options(
        selectinload(Contract.parties),
        selectinload(Contract.key_dates),
        selectinload(Contract.financial_terms),
        selectinload(Contract.risks)
    )
    
    # Filter by current user - only show their contracts
    query = query.where(Contract.uploaded_by == current_user.id)
    
    # Apply filters
    if search:
        query = query.where(
            or_(
                Contract.title.ilike(f"%{search}%"),
                Contract.summary.ilike(f"%{search}%")
            )
        )
    
    if industry:
        query = query.where(Contract.industry == industry)
    
    if governing_law:
        query = query.where(Contract.governing_law == governing_law)
    
    if status:
        query = query.where(Contract.status == status)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    result = await db.execute(count_query)
    total = result.scalar()
    
    # Apply pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    contracts = result.scalars().all()
    
    # Convert to response format
    items = []
    for contract in contracts:
        items.append({
            "id": contract.id,
            "title": contract.title,
            "file_name": contract.file_name,
            "file_type": contract.file_type.value,
            "upload_date": contract.upload_date.isoformat(),
            "uploaded_by": contract.uploaded_by,
            "status": contract.status.value,
            "parties": [
                {
                    "id": p.id,
                    "name": p.name,
                    "type": p.type.value,
                    "role": p.role.value
                } for p in contract.parties
            ],
            "key_dates": [
                {
                    "id": d.id,
                    "date_type": d.date_type.value,
                    "date": d.date.isoformat(),
                    "description": d.description
                } for d in contract.key_dates
            ],
            "financial_terms": [
                {
                    "id": t.id,
                    "term_type": t.term_type.value,
                    "amount": t.amount,
                    "currency": t.currency,
                    "schedule": t.schedule,
                    "description": t.description
                } for t in contract.financial_terms
            ],
            "governing_law": contract.governing_law,
            "jurisdiction": contract.jurisdiction,
            "industry": contract.industry,
            "contract_type": contract.contract_type,
            "tags": json.loads(contract.tags) if contract.tags else [],
            "summary": contract.summary,
            "purpose": contract.purpose,
            "scope": contract.scope,
            "risks": [
                {
                    "id": r.id,
                    "risk_type": r.risk_type.value,
                    "severity": r.severity.value,
                    "title": r.title,
                    "description": r.description,
                    "recommendation": r.recommendation,
                    "clause_reference": r.clause_reference
                } for r in contract.risks
            ],
            "updated_at": contract.updated_at.isoformat()
        })
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.get("/{contract_id}")
async def get_contract(
    contract_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed information about a specific contract.
    TODO: Backend team needs to implement access control.
    """
    query = select(Contract).where(
        Contract.id == contract_id,
        Contract.uploaded_by == current_user.id  # Only allow user to access their own contracts
    ).options(
        selectinload(Contract.parties),
        selectinload(Contract.key_dates),
        selectinload(Contract.financial_terms),
        selectinload(Contract.risks),
        selectinload(Contract.clauses)
    )
    
    result = await db.execute(query)
    contract = result.scalar_one_or_none()
    
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    return {
        "id": contract.id,
        "title": contract.title,
        "file_name": contract.file_name,
        "file_path": contract.file_path,
        "file_type": contract.file_type.value,
        "upload_date": contract.upload_date.isoformat(),
        "uploaded_by": contract.uploaded_by,
        "status": contract.status.value,
        "parties": [
            {
                "id": p.id,
                "contract_id": p.contract_id,
                "name": p.name,
                "type": p.type.value,
                "role": p.role.value
            } for p in contract.parties
        ],
        "key_dates": [
            {
                "id": d.id,
                "contract_id": d.contract_id,
                "date_type": d.date_type.value,
                "date": d.date.isoformat(),
                "description": d.description
            } for d in contract.key_dates
        ],
        "financial_terms": [
            {
                "id": t.id,
                "contract_id": t.contract_id,
                "term_type": t.term_type.value,
                "amount": t.amount,
                "currency": t.currency,
                "schedule": t.schedule,
                "description": t.description
            } for t in contract.financial_terms
        ],
        "governing_law": contract.governing_law,
        "jurisdiction": contract.jurisdiction,
        "industry": contract.industry,
        "contract_type": contract.contract_type,
        "tags": json.loads(contract.tags) if contract.tags else [],
        "summary": contract.summary,
        "purpose": contract.purpose,
        "scope": contract.scope,
        "risks": [
            {
                "id": r.id,
                "contract_id": r.contract_id,
                "risk_type": r.risk_type.value,
                "severity": r.severity.value,
                "title": r.title,
                "description": r.description,
                "recommendation": r.recommendation,
                "clause_reference": r.clause_reference
            } for r in contract.risks
        ],
        "updated_at": contract.updated_at.isoformat()
    }

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard statistics.
    TODO: Backend team needs to optimize queries and add more stats.
    """
    # Total contracts
    total_result = await db.execute(select(func.count(Contract.id)))
    total_contracts = total_result.scalar()
    
    # Pending reviews (processing status)
    pending_result = await db.execute(
        select(func.count(Contract.id)).where(Contract.status == "processing")
    )
    pending_reviews = pending_result.scalar()
    
    # High risk contracts (simplified - needs proper implementation)
    high_risk_contracts = 0  # TODO: Count contracts with high/critical risks
    
    # Expiring soon (simplified - needs proper implementation)
    expiring_soon = 0  # TODO: Count contracts expiring in next 30 days
    
    # Recent uploads
    recent_query = select(Contract).order_by(Contract.upload_date.desc()).limit(5)
    recent_result = await db.execute(recent_query)
    recent_contracts = recent_result.scalars().all()
    
    return {
        "total_contracts": total_contracts,
        "pending_reviews": pending_reviews,
        "high_risk_contracts": high_risk_contracts,
        "expiring_soon": expiring_soon,
        "recent_uploads": [
            {
                "id": c.id,
                "title": c.title,
                "file_name": c.file_name,
                "status": c.status.value,
                "upload_date": c.upload_date.isoformat()
            } for c in recent_contracts
        ]
    }
