# backend/app/routes/consultation.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, validator
import smtplib 
from email.message import EmailMessage
import os

router = APIRouter(prefix="/consultation", tags=["consultation"])


class ConsultationRequest(BaseModel):
    name: str
    email: EmailStr
    reason: str

    @validator("name")
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Имя обязательно")
        return v.strip()

    @validator("reason")
    def reason_not_empty(cls, v):
        if len(v.strip()) < 10:
            raise ValueError("Расскажите чуть подробнее")
        return v.strip()


@router.post("/request")
async def request_consultation(request: ConsultationRequest):
    # Отправляем письмо пользователю
    user_msg = EmailMessage()
    user_msg["From"] = f"Super Mood <{os.getenv('SMTP_FROM_EMAIL')}>"
    user_msg["To"] = request.email
    user_msg["Subject"] = "Мы получили вашу заявку ❤️"
    user_msg.set_content(
        f"""Здравствуйте, {request.name}!

Спасибо, что доверились нам ❤️
Мы получили вашу заявку и в ближайшее время подберём для вас подходящего психолога.

Обычно это занимает от нескольких часов до пары дней.
Мы напишем вам, как только найдём специалиста.

Если будут вопросы — пишите на этот email.

Обнимаем,
Команда Super Mood
"""
    )

    # Отправляем тебе письмо (чтобы видела заявки)
    admin_msg = EmailMessage()
    admin_msg["From"] = f"Super Mood <{os.getenv('SMTP_FROM_EMAIL')}>"
    admin_msg["To"] = os.getenv('SMTP_FROM_EMAIL')  # ← тебе на почту
    admin_msg["Subject"] = f"Новая заявка от {request.name}"
    admin_msg.set_content(
        f"""НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ

Имя: {request.name}
Email: {request.email}
Причина обращения:
{request.reason}

→ Ответь на {request.email}, когда найдёшь специалиста.
"""
    )

        # Отправляем оба письма
    try:
        print("\nПЫТАЕМСЯ ОТПРАВИТЬ ПИСЬМО ПОЛЬЗОВАТЕЛЮ...")
        print(f"SMTP: {os.getenv('SMTP_HOST')}:{os.getenv('SMTP_PORT')}")
        print(f"From: {os.getenv('SMTP_FROM_EMAIL')}")
        print(f"To: {request.email}")

        await aiosmtplib.send(
            user_msg,
            hostname=os.getenv("SMTP_HOST"),
            port=int(os.getenv("SMTP_PORT")),
            start_tls=True,
            username=os.getenv("SMTP_USER"),
            password=os.getenv("SMTP_PASSWORD"),
            validate_certs=False,  # ← добавляем на всякий случай
        )
        print("Письмо пользователю — УСПЕШНО!")

        print("Отправляем админу...")
        await aiosmtplib.send(
            admin_msg,
            hostname=os.getenv("SMTP_HOST"),
            port=int(os.getenv("SMTP_PORT")),
            start_tls=True,
            username=os.getenv("SMTP_USER"),
            password=os.getenv("SMTP_PASSWORD"),
            validate_certs=False,
        )
        print("Письмо админу — УСПЕШНО!")

    except Exception as e:
        # ← ВОТ ЭТО ГЛАВНОЕ — ВИДИМ НАСТОЯЩУЮ ОШИБКУ!
        print("\nОШИБКА ОТПРАВКИ ПИСЬМА:")
        print(f"Тип ошибки: {type(e).__name__}")
        print(f"Текст: {str(e)}")
        print(f"Все env-переменные:")
        print(f"HOST: {os.getenv('SMTP_HOST')}")
        print(f"USER: {os.getenv('SMTP_USER')}")
        print(f"PASSWORD: {'***' if os.getenv('SMTP_PASSWORD') else 'ПУСТО!!!'}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка SMTP: {type(e).__name__}: {str(e)}"
        )

    return {"message": "Заявка принята! Письмо отправлено, скоро напишем ❤️"}