from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from dependencies import get_current_user
from models.user import User
from models.analytics import UserAnalytics
from models.mood import MoodStory
from datetime import datetime, timedelta, timezone
from models.activity import Activity
from typing import List, Dict, Any
import random

router = APIRouter(prefix="/analytics", tags=["analytics"])


async def update_user_analytics(db: AsyncSession, user: User):
    """Обновляет аналитику пользователя с оптимизацией"""
    now = datetime.now(timezone.utc)
    
    # 1. Получаем только ID записей (быстро)
    story_ids_result = await db.execute(
        select(MoodStory.id).where(MoodStory.user_id == user.id).order_by(MoodStory.created_at)
    )
    story_ids = story_ids_result.scalars().all()
    total_entries = len(story_ids)
    
    if total_entries == 0:
        data = {
            "summary": {"total_entries": 0},
            "message": "Начни вести дневник, моя королева!",
            "updated_at": now.isoformat()
        }
    else:
        # 2. Получаем первую запись
        first_result = await db.execute(
            select(func.min(MoodStory.created_at)).where(MoodStory.user_id == user.id)
        )
        first_entry = first_result.scalar()
        days_active = (now - first_entry).days + 1
        
        # 3. Загружаем только нужные поля (ограничиваем количество)
        stories_result = await db.execute(
            select(MoodStory.created_at, MoodStory.moods, MoodStory.activities)
            .where(MoodStory.user_id == user.id)
            .limit(500)  # Ограничиваем последними 500 записями
        )
        stories = stories_result.all()
        
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
    
    # Сохраняем в БД
    analytics = await db.get(UserAnalytics, user.id)
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
    force: bool = Query(False, description="Принудительное обновление аналитики")
):
    # Проверяем кеш (данные не старше 1 часа)
    analytics = await db.get(UserAnalytics, current_user.id)
    
    # Если force=true — игнорируем кеш и пересчитываем
    if force:
        await update_user_analytics(db, current_user)
        analytics = await db.get(UserAnalytics, current_user.id)
        return analytics.data or {"total_entries": 0}
    
    if analytics and analytics.updated_at:
        age = (datetime.now(timezone.utc) - analytics.updated_at).total_seconds()
        if age < 3600:  # 1 час
            return analytics.data or {"total_entries": 0}
    
    # Пересчитываем
    await update_user_analytics(db, current_user)
    analytics = await db.get(UserAnalytics, current_user.id)
    return analytics.data or {"total_entries": 0}


@router.get("/insights")
async def get_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Получаем все записи пользователя
    result = await db.execute(
        select(MoodStory).where(MoodStory.user_id == current_user.id).order_by(MoodStory.created_at)
    )
    stories = result.scalars().all()
    
    if len(stories) < 3:
        return {"insights": ["Пока недостаточно данных для анализа. Добавьте ещё несколько записей!"]}
    
    insights = []
    
    # Определения эмоций
    sadness_moods = ["sadness", "grief", "disgust", "anger", "rage", "annoyance"]
    joy_moods = ["joy", "ecstasy", "admiration", "love", "optimism"]
    weekday_names = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"]
    
    # 1. Анализ по дням недели
    weekday_moods = {i: [] for i in range(7)}
    for story in stories:
        weekday = story.created_at.weekday()
        for mood in story.moods or []:
            weekday_moods[weekday].append(mood)
    
    # Самый грустный день
    sad_counts = {i: sum(1 for mood in weekday_moods[i] if mood in sadness_moods) for i in range(7)}
    if max(sad_counts.values()) > 0:
        worst_day = max(sad_counts, key=sad_counts.get)
        day_name = weekday_names[worst_day]
        # Склонение для воскресенья
        if day_name == "воскресенье":
            preposition = "в"
            day_form = f"{preposition} {day_name}"
        else:
            preposition = "по"
            day_form = f"{preposition} {day_name}м"
        if sad_counts[worst_day] > 0:
            insights.append(f"Такса заметила, что вы чаще испытываете грусть {day_form}. Попробуйте запланировать что-то приятное на этот день!")
    
    # Самый позитивный день
    joy_counts = {i: sum(1 for mood in weekday_moods[i] if mood in joy_moods) for i in range(7)}
    if max(joy_counts.values()) > 0:
        best_day = max(joy_counts, key=joy_counts.get)
        day_name = weekday_names[best_day]
        if day_name == "воскресенье":
            preposition = "в"
            day_form = f"{preposition} {day_name}"
        else:
            preposition = "по"
            day_form = f"{preposition} {day_name}м"
        if joy_counts[best_day] > 0:
            insights.append(f"Такса заметила, что ваш самый позитивный день — {day_form}! Отличное время для важных дел.")
    
    # 2. Анализ активностей и их влияния на настроение
    activity_mood_map: Dict[int, Dict[str, int]] = {}
    for story in stories:
        for act in story.activities or []:
            act_id = act.get("activity_id") if isinstance(act, dict) else act
            if act_id:
                if act_id not in activity_mood_map:
                    activity_mood_map[act_id] = {"total": 0, "happy": 0, "sad": 0, "moods": []}
                activity_mood_map[act_id]["total"] += 1
                for mood in story.moods or []:
                    activity_mood_map[act_id]["moods"].append(mood)
                    if mood in joy_moods:
                        activity_mood_map[act_id]["happy"] += 1
                    elif mood in sadness_moods:
                        activity_mood_map[act_id]["sad"] += 1
    
    # Загружаем названия активностей
    from models.activity import Activity
    
    # Находим самую позитивную активность
    best_activity = None
    best_activity_score = 0
    worst_activity = None
    worst_activity_score = 0
    
    for act_id, data in activity_mood_map.items():
        if data["total"] >= 2:  # минимум 2 записи с этой активностью
            happy_percent = (data["happy"] / data["total"]) * 100 if data["total"] > 0 else 0
            sad_percent = (data["sad"] / data["total"]) * 100 if data["total"] > 0 else 0
            
            if happy_percent > best_activity_score and happy_percent > 50:
                best_activity_score = happy_percent
                best_activity = act_id
            
            if sad_percent > worst_activity_score and sad_percent > 60:
                worst_activity_score = sad_percent
                worst_activity = act_id
    
    # Инсайт о позитивной активности
    if best_activity and best_activity_score > 50:
        act_result = await db.execute(select(Activity).where(Activity.id == best_activity))
        activity = act_result.scalar_one_or_none()
        if activity:
            insights.append(f"Такса заметила, что после «{activity.name}» ваше настроение становится лучше! Отличный повод заниматься этим чаще.")
    
    # Инсайт о негативной активности
    if worst_activity and worst_activity_score > 60:
        act_result = await db.execute(select(Activity).where(Activity.id == worst_activity))
        activity = act_result.scalar_one_or_none()
        if activity:
            insights.append(f"Такса заметила, что вы чувствуете себя печально, когда занимаетесь «{activity.name}». Попробуйте уделять этому меньше времени или ищите позитивные стороны.")
    
    # 3. Анализ времени суток
    hour_moods = {i: [] for i in range(24)}
    for story in stories:
        hour = story.created_at.hour
        for mood in story.moods or []:
            hour_moods[hour].append(mood)
    
    # Находим самое грустное время
    sad_hour_counts = {h: sum(1 for mood in hour_moods[h] if mood in sadness_moods) for h in range(24)}
    if max(sad_hour_counts.values()) > 0:
        worst_hour = max(sad_hour_counts, key=sad_hour_counts.get)
        time_period = ""
        if 6 <= worst_hour < 12:
            time_period = "утро"
        elif 12 <= worst_hour < 18:
            time_period = "день"
        elif 18 <= worst_hour < 24:
            time_period = "вечер"
        else:
            time_period = "ночь"
        if sad_hour_counts[worst_hour] > 0:
            insights.append(f"Такса заметила, что чаще всего грустное настроение посещает вас {time_period}м. Попробуйте запланировать приятные занятия на это время.")
    
    # 4. Общая статистика
    total_moods = []
    for story in stories:
        total_moods.extend(story.moods or [])
    
    if total_moods:
        joy_percent = sum(1 for mood in total_moods if mood in joy_moods) / len(total_moods) * 100
        sadness_percent = sum(1 for mood in total_moods if mood in sadness_moods) / len(total_moods) * 100
        
        if joy_percent > 60:
            insights.append(f"Такса заметила, что у вас отличный эмоциональный фон! {joy_percent:.0f}% записей — позитивные. Так держать!")
        elif sadness_percent > 30:
            insights.append(f"Такса заметила, что вы справляетесь! Но в {sadness_percent:.0f}% записей вы грустили. Обратите внимание на активности, которые вас радуют.")
    
    # 5. Регулярность ведения дневника
    if len(stories) >= 7:
        # Группируем по неделям
        last_7_days = []
        for story in stories[-7:]:
            last_7_days.append(story.created_at.date())
        unique_days = len(set(last_7_days))
        if unique_days >= 5:
            insights.append(f"Такса заметила, что вы ведёте дневник почти каждый день! Отличная регулярность — это помогает лучше понимать себя.")
        elif unique_days <= 2:
            insights.append(f"Такса заметила, что вы делаете записи нерегулярно. Попробуйте уделять дневнику хотя бы пару минут каждый день!")
    
    # Перемешиваем инсайты для разнообразия
    random.shuffle(insights)
    
    # Ограничиваем количество инсайтов до 4
    return {"insights": insights[:4]}