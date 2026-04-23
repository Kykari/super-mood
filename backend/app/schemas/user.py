from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from models.user import UserRole

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    role: str
    created_at: datetime
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None
    blocked_reason: Optional[str] = None

    class Config:
        from_attributes = True
        use_enum_values = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

class UserUpdateAdmin(BaseModel):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    blocked_reason: Optional[str] = None