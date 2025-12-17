import os
import logging
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type
import asyncpg
import asyncpg.exceptions
from typing import AsyncIterator

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("super_mood")

DATABASE_URL = f"postgresql+asyncpg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@db:5432/{os.getenv('POSTGRES_DB')}"

engine = create_async_engine(DATABASE_URL, echo=False, future=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


@retry(
    stop=stop_after_attempt(10),
    wait=wait_fixed(3),
    retry=retry_if_exception_type((
        asyncpg.exceptions.ConnectionDoesNotExistError,
        asyncpg.exceptions.CannotConnectNowError,
        ConnectionRefusedError,
        TimeoutError,
        OSError,
    )),
    reraise=True,
)
async def check_db_connection() -> None:
    logger.info("Проверяю подключение к базе...")
    try:
        conn = await asyncpg.connect(
            dsn=DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
        )
        await conn.close()
        logger.info("Подключение к базе — УСПЕШНО!")
    except Exception as e:
        logger.error("Ошибка подключения: %s", e)
        raise


async def init_db() -> None:
    await check_db_connection()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Таблицы созданы")


async def get_db() -> AsyncIterator[AsyncSession]:
    async with async_session() as session:
        yield session