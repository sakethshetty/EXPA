from fastapi import APIRouter
from controllers.admin_controller.camp_on_weekend import get_camp
from controllers.admin_controller.trainer_in_camp import get_trainers
from validation_models.models import Weekend, Camp
from fastapi import Request

router = APIRouter()

@router.post("/camp_on_weekend")
async def camp_on_weekend(weekend : Weekend, requests: Request):
    data = await get_camp(weekend, requests)
    return data

@router.post("/trainer_in_camp")
async def trainer_in_camp(camp : Camp, requests: Request):
    data = await get_trainers(camp, requests)
    return data

@router.get("/get_details")
async def get_details(requests: Request):
    data = requests.app.database['admin'].find_one({requests.state.user_id})
    return {"status": "success", "details": data}
