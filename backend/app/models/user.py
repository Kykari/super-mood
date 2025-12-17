# backend/app/models/user.py
from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Enum as SQLAEnum
from enum import StrEnum
from datetime import datetime
from database import Base 
from models.mood import MoodStory
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Column

class UserRole(StrEnum):
    USER = "user"          
    PSYCHOLOGIST = "psychologist"  
    ADMIN = "admin"        

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    email: Mapped[str] = mapped_column(
        String, unique=True, index=True, nullable=False
    )
    
    username: Mapped[str] = mapped_column(
        String, unique=True, index=True, nullable=False
    )
    
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    
    role: Mapped[UserRole] = mapped_column(
        SQLAEnum(UserRole),
        default=UserRole.USER,     
        nullable=False
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    bio = Column(String, nullable=True, default=None)
    stories: Mapped[list[MoodStory]] = relationship("MoodStory", back_populates="user", cascade="all, delete-orphan")
    def __repr__(self) -> str:
        return f"<User {self.username} ({self.role})>"
    

    analytics = relationship("UserAnalytics", uselist=False, cascade="all, delete-orphan")
    