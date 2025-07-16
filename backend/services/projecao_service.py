from typing import Dict, Any
from repositories.projecao_repository import ProjecaoRepository
from services.relatorio_service import RelatorioService
from services.gemini_service import GeminiService

class ProjecaoService:
    def __init__(self):
        self.projecao_repo = ProjecaoRepository()
        self.relatorio_service = RelatorioService()
        self.gemini_service = GeminiService()

    def gerar_projecao_avalie_terra(self, relatorio_id: int) -> Dict[str, Any]:
        # 1. Buscar o relatório existente
        relatorio = self.relatorio_service.get_relatorio_by_id(relatorio_id)
        if not relatorio:
            raise ValueError("Relatório não encontrado para gerar a projeção.")

        # 2. Formatar os KPIs para passar para o serviço de IA
        kpis = self.relatorio_service._format_kpis_for_frontend(relatorio)

        # 3. Gerar o "AI Blueprint"
        ai_blueprint_data = self.gemini_service.generate_ai_blueprint(kpis)

        # 4. Preparar e salvar os dados da projeção
        projecao_data = {
            "relatorio_id": relatorio_id,
            **ai_blueprint_data
        }
        
        return self.projecao_repo.create(projecao_data) 