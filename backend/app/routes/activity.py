# backend/app/routes/activity.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.activity import Activity, ActivityCategory

router = APIRouter(prefix="/activities", tags=["activities"])

# Существующий эндпоинт (оставляем для обратной совместимости)
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

# НОВЫЙ ЭНДПОИНТ - сгруппированные активности
@router.get("/grouped")
async def get_activities_grouped(db: AsyncSession = Depends(get_db)):
    # Получаем все категории с их активностями
    result = await db.execute(
        select(ActivityCategory)
        .options(selectinload(ActivityCategory.activities))  # подгружаем активности
        .order_by(ActivityCategory.name)
    )
    
    categories = result.scalars().all()
    
    # Формируем ответ в нужном формате
    grouped = []
    for category in categories:
        if category.activities:  # только категории с активностями
            grouped.append({
                "id": category.id,
                "name": category.name,
                "activities": [
                    {
                        "id": act.id,
                        "name": act.name,
                        "icon_key": act.icon_key
                    }
                    for act in category.activities
                ]
            })
    
    return grouped