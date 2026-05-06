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
from models.mood import MoodStory

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
        return {"insights": ["📝 Пока недостаточно данных для анализа. Добавьте ещё несколько записей!"]}
    
    insights = []
    
    # 1. Анализ по дням недели
    weekday_moods = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
    weekday_names = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"]
    
    for story in stories:
        weekday = story.created_at.weekday()
        for mood in story.moods or []:
            weekday_moods[weekday].append(mood)
    
    # Находим самый грустный день
    sadness_moods = ["sadness", "grief", "disgust", "anger", "rage", "annoyance"]
    sad_counts = {}
    for i in range(7):
        sad_counts[i] = sum(1 for mood in weekday_moods[i] if mood in sadness_moods)
    
    if max(sad_counts.values()) > 0:
        worst_day = max(sad_counts, key=sad_counts.get)
        if sad_counts[worst_day] > 0:
            insights.append(f"вы чаще испытываете грусть в {weekday_names[worst_day]}. Попробуйте запланировать что-то приятное на этот день!")
    
    # 2. Лучший день недели
    joy_moods = ["joy", "ecstasy", "admiration", "love", "optimism"]
    joy_counts = {}
    for i in range(7):
        joy_counts[i] = sum(1 for mood in weekday_moods[i] if mood in joy_moods)
    
    if max(joy_counts.values()) > 0:
        best_day = max(joy_counts, key=joy_counts.get)
        if joy_counts[best_day] > 0:
            insights.append(f"ваш самый позитивный день — {weekday_names[best_day]}! Отличное время для важных дел.")
    
    # 3. Анализ активностей (с категориями)
    activities_moods = {}
    for story in stories:
        for act in story.activities or []:
            act_id = act.get("activity_id") if isinstance(act, dict) else act
            if act_id:
                if act_id not in activities_moods:
                    activities_moods[act_id] = []
                for mood in story.moods or []:
                    activities_moods[act_id].append(mood)
    
    # Загружаем названия активностей
    from models.activity import Activity
    best_activity = None
    best_activity_score = -1
    best_activity_name = ""
    
    for act_id, moods in activities_moods.items():
        if len(moods) >= 3:  # минимум 3 записи
            joy_count = sum(1 for mood in moods if mood in joy_moods)
            score = joy_count / len(moods)
            if score > best_activity_score:
                best_activity_score = score
                best_activity_id = act_id
    
    if best_activity_id and best_activity_score > 0.6:
        act_result = await db.execute(select(Activity).where(Activity.id == best_activity_id))
        activity = act_result.scalar_one_or_none()
        if activity:
            insights.append(f"после «{activity.name}» ваше настроение становится лучше! Отличный повод заниматься этим чаще.")
    
    # 4. Общая статистика
    total_moods = []
    for story in stories:
        total_moods.extend(story.moods or [])
    
    if total_moods:
        joy_percent = sum(1 for mood in total_moods if mood in joy_moods) / len(total_moods) * 100
        sadness_percent = sum(1 for mood in total_moods if mood in sadness_moods) / len(total_moods) * 100
        
        if joy_percent > 60:
            insights.append(f"у вас отличный эмоциональный фон! {joy_percent:.0f}% записей — позитивные.")
        elif sadness_percent > 30:
            insights.append(f"вы справляетесь! Но в {sadness_percent:.0f}% записей вы грустили. Обратите внимание на активности, которые вас радуют.")
    
    # 5. Добавим инсайт про регулярность
    if len(stories) > 0:
        # Группируем по месяцам
        months_count = {}
        for story in stories:
            month_key = story.created_at.strftime("%Y-%m")
            months_count[month_key] = months_count.get(month_key, 0) + 1
        
        if months_count:
            avg_per_month = sum(months_count.values()) / len(months_count)
            if avg_per_month < 4:
                insights.append(f"вы делаете записи в среднем {avg_per_month:.0f} раз в месяц. Регулярное ведение дневника поможет лучше понимать себя!")
            elif avg_per_month > 15:
                insights.append(f"отличная регулярность! Вы делаете записи почти каждый день. Так держать!")
    
    return {"insights": insights}