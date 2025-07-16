from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
import traceback
from services.projecao_service import ProjecaoService
from models import AvalieTerraResponse

router = APIRouter()

def get_projecao_service():
    return ProjecaoService()

@router.post("/gerar-avalie-terra/{relatorio_id}", response_model=Dict[str, Any])
async def gerar_avalie_terra(
    relatorio_id: int,
    projecao_service: ProjecaoService = Depends(get_projecao_service)
):
    try:
        projecao = projecao_service.gerar_projecao_avalie_terra(relatorio_id)
        return {"success": True, "data": projecao}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("--- ERRO INTERNO DO SERVIDOR ---")
        traceback.print_exc()
        print("---------------------------------")
        raise HTTPException(status_code=500, detail="Erro interno do servidor ao gerar projeção.") 