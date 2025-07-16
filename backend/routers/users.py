from fastapi import APIRouter, Depends
from typing import Dict, Any
from services.user_service import UserService

router = APIRouter()

def get_user_service():
    return UserService()

@router.get("/{user_id}", response_model=Dict[str, Any])
async def get_user_by_id(user_id: int, user_service: UserService = Depends(get_user_service)):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return {"success": False, "message": "Usuário não encontrado"}
    return {"success": True, "data": user} 