import os
from fastapi import FastAPI
from routes.calender import router as calender
from routes.auth_router import router as auth_router
from routes.trainer_router import router as trainer_router
from routes.admin_router import router as admin_router
from pymongo import MongoClient
from services.allocation import allocate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# Create the scheduler
scheduler = BackgroundScheduler()

# Define a job function to be scheduled
def schedule_allocate():
    allocate(app.database)

# Add a daily job
scheduler.add_job(schedule_allocate, CronTrigger(hour=0, minute=0))  # Runs every day at midnight

# Start the scheduler
scheduler.start()


@app.on_event("startup")
def startup_db_client():
    atlas_uri = "mongodb+srv://sadvaithas:12345@expa.ia6icol.mongodb.net/"
    db_name = "exap"

    if not atlas_uri or not db_name:
        raise ValueError("Environment variables ATLAS_URI and DB_NAME must be set")

    app.mongodb_client = MongoClient(atlas_uri)
    app.database = app.mongodb_client[db_name]
    # print(app.database.admin.find_one())
    # os.chdir("app")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(calender, prefix="/calender")
app.include_router(auth_router, prefix="/auth")
app.include_router(admin_router, prefix="/admin")
app.include_router(trainer_router, prefix="/trainer")