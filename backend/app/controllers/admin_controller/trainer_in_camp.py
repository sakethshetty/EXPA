from validation_models.models import Camp
from fastapi import Request

async def get_trainers(camp: Camp, requests: Request):
    trainers_cursor = requests.app.database['temp_alloc'].find({"camp_id": camp.id})
    trainers_list = []
    for trainerDetail in trainers_cursor:
        if trainerDetail["status"] not in ["registered", "allocated"]:
            continue
        trainer = requests.app.database['trainer'].find_one({"id": trainerDetail["trainer_id"]})
        # print(trainer)
    #     if trainer["status"] in ["registered", "allocated"]:
        trainer["_id"] = str(trainer["_id"])
        trainer["status"] = trainerDetail["status"]
        trainers_list.append(trainer)
    # print(trainers_list)
        
    return {"status": "success", "trainers": trainers_list}
