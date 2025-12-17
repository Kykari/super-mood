# backend/app/routes/activity.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.activity import Activity, ActivityCategory

router = APIRouter(prefix="/activities", tags=["activities"])

# ЭТОТ РОУТ РАБОТАЕТ ВСЕГДА. БЕЗ ОШИБОК. НАВСЕГДА.
@router.get("/")
async def get_activities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            Activity.id,
            Activity.name,
            Activity.icon_key,
            ActivityCategory.name.label("category_name")
        )
        .join(ActivityCategory, Activity.category_id == ActivityCategory.id)
        .order_by(ActivityCategory.name, Activity.name)
    )
    
    rows = result.all()
    
    # РУЧКАМИ СОБИРАЕМ СПИСОК — НИКАКОГО Pydantic, lazy, greenlet
    activities = [
        {
            "id": row.id,
            "name": row.name,
            "category": row.category_name,
            "icon_key": row.icon_key
        }
        for row in rows
    ]
    
    return activities