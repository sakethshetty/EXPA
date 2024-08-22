from validation_models.models import Trainer
from fastapi import Request

async def get_camp(trainer: Trainer, requests: Request):
    allocDetails = requests.app.database['temp_alloc'].find({"trainer_id": trainer.id})
    
    camps = []
    for allocDetail in allocDetails:
        if allocDetail['status'] in ['registered', 'allocated']:
            camp = requests.app.database['camp'].find_one({"id": allocDetail["camp_id"]})
            if camp:
                camp["_id"] = str(camp["_id"])
                camp["status"] = allocDetail["status"]
                camps.append(camp)

    return {"status": "success", "camps": camps}
