from fastapi import APIRouter
from controllers.auth_controller import login as login_controller
from validation_models.models import LoginRequest
from fastapi import Request

router = APIRouter()

@router.post("/login")
async def login(login: LoginRequest, requests: Request):
    data = await login_controller.login(login, requests)
    return data