from decouple import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from routers.users import router as users_router
from routers.tasks import router as tasks_router
from routers.googlesheets import router as googlesheets_router

DB_URL = config('DB_URL', cast=str)
DB_NAME = config('DB_NAME', cast=str)

# define origins
origins = [
  "http://localhost:3000"
]

# instantiate the app
app = FastAPI()

# add CORS middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.on_event("startup")
async def startup_db_client():
  app.mongodb_client = AsyncIOMotorClient(DB_URL)
  app.mongodb = app.mongodb_client[DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
  app.mongodb_client.close()

app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
app.include_router(googlesheets_router, prefix="/googlesheets", tags=["googlesheets"])

