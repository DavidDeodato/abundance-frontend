from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from services.floresta_service import FlorestaService
from models import FlorestaCreate 

router = APIRouter()

def get_floresta_service():
    return FlorestaService()

@router.post("/", response_model=Dict[str, Any])
async def create_floresta(
    floresta_data: FlorestaCreate,
    floresta_service: FlorestaService = Depends(get_floresta_service)
):
    try:
        floresta = floresta_service.create_floresta(floresta_data.dict())
        return {"success": True, "data": floresta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {e}")

@router.get("/marketplace", response_model=Dict[str, Any])
async def get_marketplace_florestas(
    floresta_service: FlorestaService = Depends(get_floresta_service)
):
    try:
        florestas = floresta_service.get_all_for_marketplace()
        return {"success": True, "data": florestas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {e}") 