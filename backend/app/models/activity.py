from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from sqlalchemy import Column
from typing import Optional

class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("activity_categories.id"))
    category = relationship(lambda: ActivityCategory, backref="activities")
    icon_key: Mapped[Optional[str]] = mapped_column(nullable=True, default=None)

from .activity_category import ActivityCategory