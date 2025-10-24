from sqlalchemy import Column, String, Text, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from src.config.database import Base
import enum
import uuid

class RiskLevel(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Clause(Base):
    __tablename__ = "clauses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    contract_id = Column(String, ForeignKey("contracts.id"), nullable=False)
    clause_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    section_number = Column(String)
    is_standard = Column(Boolean, default=True)
    risk_level = Column(Enum(RiskLevel))
    
    contract = relationship("Contract", back_populates="clauses")
