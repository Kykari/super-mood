# backend/app/utils/minio.py — финальная рабочая версия

import boto3
import os
from uuid import uuid4
from fastapi import UploadFile, HTTPException
from botocore.client import Config
from datetime import datetime
from urllib.parse import urlparse
from typing import List, Optional

s3 = boto3.client(
    "s3",
    endpoint_url=f"http://{os.getenv('MINIO_ENDPOINT', 'minio:9000')}",
    aws_access_key_id=os.getenv("MINIO_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("MINIO_SECRET_KEY"),
    config=Config(signature_version='s3v4'),
)

BUCKET = os.getenv("MINIO_BUCKET", "mood-photos")
PUBLIC_URL = os.getenv("MINIO_PUBLIC_URL", "http://62.113.44.151:9000").rstrip("/")


async def upload_photo_to_minio(photo: UploadFile | None = None, user_id: int | None = None) -> str | None:
    if not photo or not photo.filename:
        return None

    content = await photo.read()
    if len(content) > 15 * 1024 * 1024:
        raise HTTPException(400, "Фото больше 15 МБ")

    original = photo.filename
    safe_name = "".join(c if c.isalnum() or c in "._- ()[]" else "_" for c in original)
    ext = os.path.splitext(safe_name)[1].lower()
    name = os.path.splitext(safe_name)[0]

    now = datetime.utcnow()
    prefix = f"{user_id}/{now.year}/{now.month:02d}/"
    final_key = f"{prefix}{safe_name}"

    # Проверка на существование
    try:
        s3.head_object(Bucket=BUCKET, Key=final_key)
        final_key = f"{prefix}{name}_{uuid4()}{ext}"
    except s3.exceptions.ClientError as e:
        if e.response['Error']['Code'] != '404':
            raise

    s3.put_object(
        Bucket=BUCKET,
        Key=final_key,
        Body=content,
        ContentType=photo.content_type or "image/jpeg",
    )

    return f"{PUBLIC_URL}/{BUCKET}/{final_key}"


def extract_key_from_url(url: str) -> str:
    """Извлекает ключ объекта из URL MinIO"""
    parsed = urlparse(url)
    # Убираем PUBLIC_URL и BUCKET из пути
    path = parsed.path.lstrip('/')
    if path.startswith(f"{BUCKET}/"):
        return path[len(f"{BUCKET}/"):]
    return path


def delete_photo_from_minio(url: str) -> bool:
    """Удаляет фото из MinIO по URL"""
    try:
        key = extract_key_from_url(url)
        s3.delete_object(Bucket=BUCKET, Key=key)
        return True
    except Exception as e:
        print(f"Ошибка удаления фото из MinIO: {e}")
        return False


def delete_photos_from_minio(urls: List[str]) -> None:
    """Удаляет список фото из MinIO"""
    for url in urls:
        if url and isinstance(url, str):
            delete_photo_from_minio(url)


def get_photo_key_from_url(url: str) -> Optional[str]:
    """Получает ключ фото из URL (для проверки существования)"""
    try:
        key = extract_key_from_url(url)
        s3.head_object(Bucket=BUCKET, Key=key)
        return key
    except Exception:
        return None


async def upload_multiple_photos(
    photos: List[UploadFile], 
    user_id: int
) -> List[str]:
    """Загружает несколько фото и возвращает список URL"""
    urls = []
    for photo in photos:
        if photo and photo.filename:
            try:
                url = await upload_photo_to_minio(photo, user_id)
                if url:
                    urls.append(url)
            except Exception as e:
                print(f"Ошибка загрузки фото {photo.filename}: {e}")
                continue
    return urls