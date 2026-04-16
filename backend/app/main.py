from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.story import router as story_router
from routes.analytics import router as analytics_router
from routes.consultation import router as consultation_router
from routes.activity import router as activity_router
from routes import profile

from database import init_db

app = FastAPI(
    title="Mood Tracker API",
    description="API для приложения SUPER MOOD",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth_router)
app.include_router(story_router)
app.include_router(analytics_router)
app.include_router(consultation_router)
app.include_router(activity_router)
app.include_router(profile.router)


@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
async def root():
    return {"message": "Mood Tracker API"}  