# backend/app/routes/story.py — ФИНАЛЬНЫЙ, РАБОЧИЙ, ТВОЙ

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from fastapi import Query

from database import get_db
from dependencies import get_current_user
from models.user import User
from models.activity import Activity
from models.mood import MoodStory
from schemas.story import MoodStoryOut
from utils.minio import (
    upload_photo_to_minio, 
    delete_photos_from_minio,
    delete_photo_from_minio,
    upload_multiple_photos,
    get_photo_key_from_url
)

router = APIRouter(prefix="/stories", tags=["stories"])


@router.post("/create", response_model=MoodStoryOut, status_code=201)
async def create_story(
    moods: str = Form(...),
    activity_id: str = Form(...),
    text: Optional[str] = Form(None),
    photos: List[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mood_list = [m.strip() for m in moods.split(",") if m.strip()]
    if not mood_list:
        raise HTTPException(400, detail="Выберите хотя бы одну эмоцию")

    try:
        activity_id_list = [int(x.strip()) for x in activity_id.split(",") if x.strip()]
    except ValueError:
        raise HTTPException(400, detail="Неверный формат ID активностей")

    if not activity_id_list:
        raise HTTPException(400, detail="Выберите хотя бы одну активность")

    result = await db.execute(select(Activity.id).where(Activity.id.in_(activity_id_list)))
    if len(result.scalars().all()) != len(activity_id_list):
        raise HTTPException(400, detail="Одна из активностей не существует")

    # Загрузка всех фото
    photo_urls: List[str] = []
    if photos:
        photo_urls = await upload_multiple_photos(photos, current_user.id)

    story = MoodStory(
        user_id=current_user.id,
        moods=mood_list,
        activities=[{"activity_id": aid} for aid in activity_id_list],
        text=text.strip() if text and text.strip() else None,
        photo_urls=photo_urls if photo_urls else None,
    )

    db.add(story)
    await db.commit()
    await db.refresh(story)
    return story


@router.get("/", response_model=List[MoodStoryOut])
async def get_my_stories(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(MoodStory)
        .where(MoodStory.user_id == current_user.id)
        .order_by(MoodStory.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    stories = result.scalars().all()
    return stories


@router.delete("/{story_id}", status_code=204)
async def delete_story(
    story_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Находим запись
    result = await db.execute(
        select(MoodStory)
        .where(MoodStory.id == story_id)
        .where(MoodStory.user_id == current_user.id)
    )
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(404, detail="Запись не найдена")
    
    # Удаляем фото из MinIO если они есть
    if story.photo_urls:
        delete_photos_from_minio(story.photo_urls)
    
    await db.delete(story)
    await db.commit()
    
    return {"message": "Запись удалена"}


@router.put("/{story_id}", response_model=MoodStoryOut)
async def update_story(
    story_id: int,
    moods: Optional[str] = Form(None),
    activity_id: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    new_photos: List[UploadFile] = File(None),
    photos_to_keep: Optional[str] = Form(None),  # Список URL фото которые нужно сохранить
    photos_to_delete: Optional[str] = Form(None),  # Список URL фото которые нужно удалить
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Находим запись
    result = await db.execute(
        select(MoodStory)
        .where(MoodStory.id == story_id)
        .where(MoodStory.user_id == current_user.id)
    )
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(404, detail="Запись не найдена")
    
    # Обновляем поля, если они переданы
    if moods is not None:
        mood_list = [m.strip() for m in moods.split(",") if m.strip()]
        if not mood_list:
            raise HTTPException(400, detail="Выберите хотя бы одну эмоцию")
        story.moods = mood_list
    
    if activity_id is not None:
        try:
            activity_id_list = [int(x.strip()) for x in activity_id.split(",") if x.strip()]
        except ValueError:
            raise HTTPException(400, detail="Неверный формат ID активностей")
        
        if not activity_id_list:
            raise HTTPException(400, detail="Выберите хотя бы одну активность")
        
        # Проверка активностей
        result = await db.execute(select(Activity.id).where(Activity.id.in_(activity_id_list)))
        if len(result.scalars().all()) != len(activity_id_list):
            raise HTTPException(400, detail="Одна из активностей не существует")
        
        story.activities = [{"activity_id": aid} for aid in activity_id_list]
    
    if text is not None:
        story.text = text.strip() if text.strip() else None
    
    # Обработка фото
    current_photos = story.photo_urls or []
    
    # 1. Удаляем фото, которые пользователь хочет удалить
    if photos_to_delete:
        urls_to_delete = photos_to_delete.split(",")
        for url in urls_to_delete:
            url = url.strip()
            if url in current_photos:
                current_photos.remove(url)
                # Удаляем из MinIO
                from utils.minio import delete_photo_from_minio
                delete_photo_from_minio(url)
    
    # 2. Оставляем только указанные фото
    if photos_to_keep:
        urls_to_keep = photos_to_keep.split(",")
        urls_to_keep = [url.strip() for url in urls_to_keep]
        # Удаляем все фото, которых нет в списке для сохранения
        photos_to_remove = [url for url in current_photos if url not in urls_to_keep]
        for url in photos_to_remove:
            # Удаляем из MinIO
            from utils.minio import delete_photo_from_minio
            delete_photo_from_minio(url)
        current_photos = urls_to_keep
    
    # 3. Добавляем новые фото
    new_photo_urls = []
    if new_photos:
        new_photo_urls = await upload_multiple_photos(new_photos, current_user.id)
    
    # Объединяем старые и новые фото
    story.photo_urls = current_photos + new_photo_urls
    
    # Если не осталось фото - ставим None
    if not story.photo_urls:
        story.photo_urls = None
    
    await db.commit()
    await db.refresh(story)
    return story


@router.delete("/{story_id}/photos", status_code=204)
async def delete_story_photos(
    story_id: int,
    photo_urls: str = Form(...),  # Список URL через запятую
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Удаляет конкретные фото из записи"""
    result = await db.execute(
        select(MoodStory)
        .where(MoodStory.id == story_id)
        .where(MoodStory.user_id == current_user.id)
    )
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(404, detail="Запись не найдена")
    
    if not story.photo_urls:
        raise HTTPException(400, detail="В записи нет фото")
    
    # Получаем список URL для удаления
    urls_to_delete = [url.strip() for url in photo_urls.split(",") if url.strip()]
    
    # Фильтруем существующие фото
    if story.photo_urls:
        new_photo_urls = [url for url in story.photo_urls if url not in urls_to_delete]
        
        # Удаляем фото из MinIO
        for url in urls_to_delete:
            if url in story.photo_urls:
                delete_photo_from_minio(url)
        
        # Обновляем запись
        story.photo_urls = new_photo_urls if new_photo_urls else None
        await db.commit()
    
    return {"message": "Фото удалены"}