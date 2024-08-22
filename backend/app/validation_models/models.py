from pydantic import BaseModel

class Camp(BaseModel):
    id : int
    location: str
    date: str
    camp_size : int

class TrainerToCamp(BaseModel):
    camp_id: int
    trainer_id: int

class Trainer(BaseModel):
    id: int
    username: str
    email: str
    passwd: str
    location: str
    experience: int
    gender: str

class LoginRequest(BaseModel):
    email: str
    passwd: str

class Weekend(BaseModel):
    date: str

class TrainerRoute(BaseModel):
    trainer_id: int
    camp_id: int
