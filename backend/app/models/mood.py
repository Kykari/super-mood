# backend/app/models/mood.py

from sqlalchemy import String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Enum as SQLAEnum
from datetime import datetime
from enum import StrEnum
from database import Base
from sqlalchemy import func


class PlutchikMood(StrEnum):
    # Базовые 8
    JOY = "радость"
    TRUST = "доверие"
    FEAR = "страх"
    SURPRISE = "удивление"
    SADNESS = "грусть"
    DISGUST = "отвращение"
    ANGER = "гнев"
    ANTICIPATION = "ожидание"

    # Сильные
    ECSTASY = "экстаз"
    ADMIRATION = "восхищение"
    TERROR = "ужас"
    AMAZEMENT = "изумление"
    GRIEF = "горе"
    LOATHING = "отвращение_глубокое"
    RAGE = "ярость"
    VIGILANCE = "бдительность"

    # Составные
    LOVE = "любовь"
    OPTIMISM = "оптимизм"
    SUBMISSION = "покорность"
    AWE = "благоговение"
    DISAPPROVAL = "неодобрение"
    REMORSE = "раскаяние"
    CONTEMPT = "презрение"
    AGGRESSIVENESS = "агрессивность"

    # Слабые
    SERENITY = "спокойствие"
    ACCEPTANCE = "принятие"
    APPREHENSION = "тревога"
    DISTRACTION = "рассеянность"
    PENSIVENESS = "задумчивость"
    BOREDOM = "скука"
    ANNOYANCE = "раздражение"
    INTEREST = "интерес"


class MoodStory(Base):
    __tablename__ = "mood_stories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # Список выбранных эмоций (строки из PlutchikMood)
    moods: Mapped[list[str]] = mapped_column(JSON, nullable=False)

    # Теперь храним только ID активностей — чисто, безопасно, по-взрослому
    # Пример: [{"activity_id": 5}, {"activity_id": 12}]
    activities: Mapped[list[dict]] = mapped_column(JSON, nullable=False, server_default="[]")

    text: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_urls: Mapped[list[str] | None] = mapped_column(JSON, nullable=True, server_default="[]")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    # Связи
    user = relationship("User", back_populates="stories")

    def __repr__(self) -> str:
        return f"<MoodStory {self.id} — {', '.join(self.moods)}>"