from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models.user import User
from dependencies import get_current_user
from utils.minio import upload_photo_to_minio, delete_photo_from_minio
from sqlalchemy import update

router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Проверка типа файла
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Можно загружать только изображения")
    
    # Проверка размера (5MB)
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Файл не должен превышать 5MB")
    
    # Удаляем старый аватар, если есть
    if current_user.avatar_url:
        delete_photo_from_minio(current_user.avatar_url)
    
    # Загружаем новый
    avatar_url = await upload_photo_to_minio(file, current_user.id)
    if not avatar_url:
        raise HTTPException(status_code=400, detail="Не удалось загрузить аватар")
    
    # Обновляем в БД
    stmt = update(User).where(User.id == current_user.id).values(avatar_url=avatar_url)
    await db.execute(stmt)
    await db.commit()
    
    # Обновляем объект current_user
    current_user.avatar_url = avatar_url
    
    return {"avatar_url": avatar_url}


@router.delete("/delete-avatar")
async def delete_avatar(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.avatar_url:
        raise HTTPException(status_code=404, detail="Аватар не найден")
    
    delete_photo_from_minio(current_user.avatar_url)
    
    # Обновляем в БД
    stmt = update(User).where(User.id == current_user.id).values(avatar_url=None)
    await db.execute(stmt)
    await db.commit()
    
    # Обновляем объект current_user
    current_user.avatar_url = None
    
    return {"detail": "Аватар удалён"}