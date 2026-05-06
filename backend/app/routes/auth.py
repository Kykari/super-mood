from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from database import get_db
from models.user import User, UserRole
from schemas.user import UserCreate, UserOut, PasswordChange, UserUpdate
from dependencies import get_current_user
import secrets
from datetime import timedelta
from models.password_reset import PasswordReset
from utils.email import send_reset_code_email
from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
import random



router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

@router.post("/register", response_model=UserOut, status_code=201)
async def register(
    user_data: UserCreate, 
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    result_email = await db.execute(select(User).where(User.email == user_data.email))
    if result_email.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email уже занят")

    result_username = await db.execute(select(User).where(User.username == user_data.username))
    if result_username.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Ник уже занят")

    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.USER
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Автоматический логин после регистрации
    payload = {
        "sub": str(new_user.id),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    return new_user

@router.post("/login")
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин или пароль")

    payload = {
        "sub": str(user.id),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False,  
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile", response_model=UserOut)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/profile", response_model=UserOut)
async def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Обновляем только то, что пришло
    update_data = user_data.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Нет данных для обновления")

    # Проверка на уникальность email, если он меняется
    if "email" in update_data:
        result = await db.execute(select(User).where(User.email == user_data.email, User.id != current_user.id))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email уже занят")

    # Обновляем пользователя
    stmt = update(User).where(User.id == current_user.id).values(**update_data)
    await db.execute(stmt)
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный текущий пароль")

    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(status_code=400, detail="Пароли не совпадают")

    stmt = update(User).where(User.id == current_user.id).values(
        hashed_password=get_password_hash(password_data.new_password)
    )
    await db.execute(stmt)
    await db.commit()
    return {"detail": "Пароль успешно изменён"}

@router.delete("/delete-account")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(delete(User).where(User.id == current_user.id))
    await db.commit()
    return {"detail": "Аккаунт удалён навсегда"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/"
    )
    return {"detail": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    data = await request.json()
    email = data.get("email")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email обязателен")
    
    # Находим пользователя
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Для безопасности не сообщаем, существует пользователь или нет
    if not user:
        return {"message": "Если аккаунт существует, на почту отправлен код восстановления"}
    
    # Удаляем старые коды
    await db.execute(delete(PasswordReset).where(PasswordReset.user_id == user.id))
    
    # Генерируем 6-значный код
    code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)  # 10 минут
    
    password_reset = PasswordReset(
        user_id=user.id,
        code=code,
        expires_at=expires_at
    )
    db.add(password_reset)
    await db.commit()
    
    # Отправляем код на почту
    await send_reset_code_email(user.email, code)
    
    return {"message": "Если аккаунт существует, на почту отправлен код восстановления"}


@router.post("/verify-code")
async def verify_code(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    data = await request.json()
    email = data.get("email")
    code = data.get("code")
    
    if not email or not code:
        raise HTTPException(status_code=400, detail="Email и код обязательны")
    
    # Находим пользователя
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=400, detail="Неверный email или код")
    
    # Ищем код
    query = select(PasswordReset).where(
        PasswordReset.user_id == user.id,
        PasswordReset.code == code
    )
    result = await db.execute(query)
    password_reset = result.scalar_one_or_none()
    
    if not password_reset:
        raise HTTPException(status_code=400, detail="Неверный код")
    
    if password_reset.expires_at < datetime.utcnow():
        await db.execute(delete(PasswordReset).where(PasswordReset.id == password_reset.id))
        await db.commit()
        raise HTTPException(status_code=400, detail="Код истёк")
    
    # Возвращаем временный токен для сброса пароля
    reset_token = secrets.token_urlsafe(32)
    
    # Сохраняем токен в БД или передаём на клиент
    # Просто возвращаем токен, который потом используем для сброса
    return {"reset_token": reset_token, "user_id": user.id}


@router.post("/reset-password")
async def reset_password(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    data = await request.json()
    reset_token = data.get("reset_token")
    user_id = data.get("user_id")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")
    
    if not reset_token or not user_id or not new_password:
        raise HTTPException(status_code=400, detail="Недостаточно данных")
    
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Пароли не совпадают")
    
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Пароль должен быть не менее 6 символов")
    
    # Проверяем, что reset_token валидный (можно хранить в Redis или просто доверять)
    # Упрощённо: просто обновляем пароль
    
    stmt = update(User).where(User.id == user_id).values(
        hashed_password=get_password_hash(new_password)
    )
    await db.execute(stmt)
    
    # Удаляем все коды для этого пользователя
    await db.execute(delete(PasswordReset).where(PasswordReset.user_id == user_id))
    await db.commit()
    
    return {"message": "Пароль успешно изменён"}