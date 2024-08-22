from validation_models.models import TrainerToCamp
from fastapi import Request

async def add_trainer_to_camp(trainer_to_camp: TrainerToCamp, requests: Request):
    trainer = trainer_to_camp.model_dump()
    trainer["status"] = "registered"
    result = requests.app.database['temp_alloc'].insert_one(trainer)
    return {"status": "success", "inserted_id": str(result.inserted_id)}
