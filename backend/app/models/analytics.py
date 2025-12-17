# backend/app/models/analytics.py

from sqlalchemy import String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from datetime import datetime

class UserAnalytics(Base):
    __tablename__ = "user_analytics"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    
    # Когда последний раз обновляли аналитику
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # ← ВСЯ аналитика в одном JSON — быстро, гибко, масштабируемо
    data: Mapped[dict] = mapped_column(JSON, default=dict)

    user = relationship("User", back_populates="analytics")