from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from dependencies import get_current_user
from models.user import User
from models.analytics import UserAnalytics
from models.mood import MoodStory
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/analytics", tags=["analytics"])


async def update_user_analytics(db: AsyncSession, user: User):
    now = datetime.now(timezone.utc)
    analytics = await db.get(UserAnalytics, user.id)

    stories_result = await db.execute(
        select(MoodStory).where(MoodStory.user_id == user.id)
    )
    stories = stories_result.scalars().all()

    if not stories:
        data = {
            "summary": {"total_entries": 0},
            "message": "Начни вести дневник, моя королева!",
            "updated_at": now.isoformat()
        }
    else:
        total_entries = len(stories)
        first_entry = min(s.created_at for s in stories)
        days_active = (now - first_entry).days + 1

        mood_counts = {}
        mood_by_day = {}
        mood_by_weekday = {i: {} for i in range(7)}
        mood_by_hour = {i: 0 for i in range(24)}
        activity_counts = {}

        for story in stories:
            date_str = story.created_at.strftime("%Y-%m-%d")
            weekday = story.created_at.weekday()
            hour = story.created_at.hour

            for mood in (story.moods or []):
                mood_counts[mood] = mood_counts.get(mood, 0) + 1

                if date_str not in mood_by_day:
                    mood_by_day[date_str] = {}
                mood_by_day[date_str][mood] = mood_by_day[date_str].get(mood, 0) + 1

                if mood not in mood_by_weekday[weekday]:
                    mood_by_weekday[weekday][mood] = 0
                mood_by_weekday[weekday][mood] += 1

                mood_by_hour[hour] += 1

            for act in (story.activities or []):
                act_id = act.get("activity_id") if isinstance(act, dict) else act
                if act_id and isinstance(act_id, int):
                    activity_counts[act_id] = activity_counts.get(act_id, 0) + 1

        top_mood = max(mood_counts.items(), key=lambda x: x[1])[0] if mood_counts else None
        top_activity = max(activity_counts.items(), key=lambda x: x[1])[0] if activity_counts else None

        data = {
            "summary": {
                "total_entries": total_entries,
                "days_active": days_active,
                "first_entry": first_entry.strftime("%Y-%m-%d"),
                "top_mood": top_mood,
                "top_activity_id": top_activity,
            },
            "moods_over_time": mood_by_day,
            "mood_distribution": mood_counts,
            "moods_by_weekday": mood_by_weekday,
            "moods_by_hour": mood_by_hour,
            "activity_distribution": activity_counts,
            "updated_at": now.isoformat(),
        }


    if analytics:
        analytics.data = data
        analytics.updated_at = now
    else:
        analytics = UserAnalytics(user_id=user.id, data=data, updated_at=now)
        db.add(analytics)

    await db.commit()


@router.get("/", response_model=dict)
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await update_user_analytics(db, current_user)
    analytics = await db.get(UserAnalytics, current_user.id)
    return analytics.data or {"total_entries": 0}