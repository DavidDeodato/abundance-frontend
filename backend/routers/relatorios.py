from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from services.relatorio_service import RelatorioService
from models import MapeieTerraInput, MapeieTerraResponse

router = APIRouter()

def get_relatorio_service():
    return RelatorioService()

@router.post("/process-mapeie", response_model=Dict[str, Any])
async def process_mapeie_submission(
    mapeie_data: MapeieTerraInput,
    relatorio_service: RelatorioService = Depends(get_relatorio_service)
):
    try:
        result = relatorio_service.process_mapeie_submission(mapeie_data.dict())
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor") 