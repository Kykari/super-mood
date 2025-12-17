# backend/seed_activities.py — КОПИРУЙ ЦЕЛИКОМ

import asyncio
from database import get_db
from models.activity import Activity, ActivityCategory
from sqlalchemy import select

# 10 категорий
CATEGORIES = [
    "Работа / учёба",
    "Отдых",
    "Спорт",
    "Еда",
    "Природа",
    "Общение",
    "Творчество",
    "Уход за собой",
    "Дом / быт",
    "Саморазвитие",
]

# По 5 активностей на категорию — в именительном падеже, универсально
ACTIVITIES_BY_CATEGORY = [
    # Работа / учёба
    ["Работа за компьютером", "Созвон", "Обучение", "Чтение", "Планирование"],
    # Отдых
    ["Сериал", "Книга", "Видеоигры", "Музыка", "Просто отдых"],
    # Спорт
    ["Бег", "Тренажёрный зал", "Йога", "Велосипед", "Прогулка"],
    # Еда
    ["Кофе", "Готовка", "Вкусная еда", "Алкоголь", "Доставка"],
    # Природа
    ["Парк", "Прогулка с собакой", "Лес", "Свежий воздух", "За городом"],
    # Общение
    ["Встреча с друзьями", "Звонок родным", "Переписка", "Тусовка", "Новое знакомство"],
    # Творчество
    ["Рисование", "Фотография", "Музыка", "Писательство", "Рукоделие"],
    # Уход за собой
    ["Душ", "Уход за кожей", "Медитация", "Дневной сон", "Растяжка"],
    # Дом / быт
    ["Уборка", "Стирка", "Уход за растениями", "Готовка на неделю", "Дела по дому"],
    # Саморазвитие
    ["Дневник", "Планирование дня", "Изучение языка", "Финансы", "Полезное чтение"],
]

async def seed_activities():
    async for db in get_db():
        # Проверяем, есть ли уже категории
        categories_count = await db.execute(select(ActivityCategory))
        if categories_count.scalars().first():
            print("Категории уже есть — пропускаем сид")
            return

        print("Создаю 10 категорий и 50 активностей...")

        # Создаём категории
        category_objects = []
        for name in CATEGORIES:
            cat = ActivityCategory(name=name)
            db.add(cat)
            category_objects.append(cat)
        await db.flush()  # чтобы получить id

        # Создаём активности
        for i, category in enumerate(category_objects):
            for name in ACTIVITIES_BY_CATEGORY[i]:
                db.add(Activity(name=name, category_id=category.id))

        await db.commit()
        print("ГОТОВО! 10 категорий + 50 активностей добавлены по твоей идеальной архитектуре")

if __name__ == "__main__":
    asyncio.run(seed_activities())