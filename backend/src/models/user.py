from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.sql import func
from src.config.database import Base
import enum
import uuid

class UserRole(enum.Enum):
    admin = "admin"
    legal_officer = "legal_officer"
    procurement_manager = "procurement_manager"
    compliance_officer = "compliance_officer"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.legal_officer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
