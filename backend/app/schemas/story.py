# backend/app/schemas/story.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from pydantic import ConfigDict


class ActivityInStory(BaseModel):
    activity_id: int


class MoodStoryOut(BaseModel):
    id: int
    moods: List[str]
    activities: List[ActivityInStory]
    text: Optional[str] = None
    photo_urls: Optional[List[str]] = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class MoodStoryUpdate(BaseModel):
    """Схема для обновления записи"""
    moods: Optional[List[str]] = None
    activity_ids: Optional[List[int]] = None
    text: Optional[str] = None
    new_photos: Optional[List[str]] = None
    photos_to_keep: Optional[List[str]] = None
    photos_to_delete: Optional[List[str]] = None