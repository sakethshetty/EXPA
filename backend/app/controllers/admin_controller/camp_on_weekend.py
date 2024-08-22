from validation_models.models import Weekend
from fastapi import Request

async def get_camp(weekend: Weekend, requests: Request):
    camps_cursor = requests.app.database['camp'].find({"date": weekend.date})
    camps_list = []
    for camp in camps_cursor:
        camp["_id"] = str(camp["_id"])
        camps_list.append(camp)
        
    return {"status": "success", "camps": camps_list}
