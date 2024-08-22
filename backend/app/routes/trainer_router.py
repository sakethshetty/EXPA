from fastapi import APIRouter
from controllers.trainer_controller.camp_for_trainer import get_camp
from validation_models.models import Trainer, TrainerRoute
from fastapi import Request

router = APIRouter()

@router.post("/camp_for_trainer")
async def camp_for_trainer(trainer : Trainer, requests: Request):
    data = await get_camp(trainer, requests)
    return data

@router.post("/get_details")
async def get_details(trainer : Trainer, requests: Request):
    data = requests.app.database['trainer'].find_one({"id" : trainer.id})
    data["_id"] = str(data["_id"])
    return {"status": "success", "details": data}

@router.post("/route")
async def route(trainerRoute : TrainerRoute, requests: Request):
    data = requests.app.database['route'].find_one(trainerRoute.model_dump())
    data["_id"] = str(data["_id"])
    return {"status": "success", "details": data}