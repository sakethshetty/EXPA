from fastapi import APIRouter, HTTPException
from validation_models.models import LoginRequest
from fastapi import  Request
import jwt
from datetime import datetime, timedelta

router = APIRouter()

async def login(user: LoginRequest, requests : Request):
    try:
        admin = requests.app.database['admin'].find_one()
        if admin["email"] == user.email and admin["passwd"] == user.passwd:
            role = "admin"
        else:
            trainer = requests.app.database['trainer'].find_one({"email" : user.email})
            # trainer = await database.fetch_one(trainer_query)

            if trainer["passwd"] == user.passwd:
                role = "trainer"
            else:
                raise HTTPException(status_code=401, detail="Authentication failed")

        token = jwt.encode({
            'user_id': admin['id'] if admin else trainer['id'],
            'role': role,
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, 'your-secret-key', algorithm='HS256')

        return {"token": token, "role":role, "id":admin['id'] if admin else trainer['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Login failed")