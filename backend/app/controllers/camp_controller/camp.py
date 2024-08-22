from validation_models.models import Camp
from fastapi import Request

async def add_camp(camp: dict, requests: Request):
    result = requests.app.database['camp'].insert_one(camp.dict())
    return {"status": "success", "inserted_id": str(result.inserted_id)}
