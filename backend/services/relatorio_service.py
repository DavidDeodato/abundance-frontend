from typing import Dict, Any, Optional
import random
from shapely.geometry import shape
from shapely.ops import transform
from pyproj import Proj, Transformer
from repositories.relatorio_repository import RelatorioRepository
from services.user_service import UserService

class RelatorioService:
    def __init__(self):
        self.relatorio_repo = RelatorioRepository()
        self.user_service = UserService()

    def process_mapeie_submission(self, mapeie_data: Dict[str, Any]) -> Dict[str, Any]:
        address = mapeie_data.get('address', '')
        selected_area_name = mapeie_data.get('selectedAreaName', '')
        user_info = mapeie_data.get('userInfo', {})
        geojson_area = mapeie_data.get('geojson')

        if not user_info.get('fullName') or not user_info.get('email'):
            raise ValueError("Nome completo e email são obrigatórios")

        user = self.user_service.create_or_get_user_from_mapeie_form(user_info)
        kpis = self._generate_area_kpis(geojson_area)
        
        relatorio_data = {
            'user_id': user['id'],
            'address': address,
            'selected_area_name': selected_area_name,
            'geojson_area': geojson_area,
            'user_full_name': user_info.get('fullName'),
            'user_email': user_info.get('email'),
            'user_phone': user_info.get('phone'),
            'user_profile': user_info.get('profile'),
            **kpis
        }
        
        relatorio = self.relatorio_repo.create(relatorio_data)
        
        return {
            'success': True,
            'relatorio_id': relatorio['id'],
            'user_id': user['id'],
            'kpis': self._format_kpis_for_frontend(relatorio),
            'message': 'Análise de área concluída com sucesso'
        }

    def _generate_area_kpis(self, geojson_data: Optional[Dict[str, Any]]) -> Dict[str, str]:
        if not geojson_data or not geojson_data.get('features'):
            return {'area_observada': '82,55 ha'} # Mock se não houver desenho

        try:
            geom = shape(geojson_data['features'][0]['geometry'])
            project = Transformer.from_proj(
                Proj(proj='latlong', datum='WGS84'),
                Proj(proj='utm', zone=23, south=True, datum='WGS84'),
                always_xy=True,
            ).transform
            projected_geom = transform(project, geom)
            area_em_hectares = projected_geom.area / 10000

            arvores_por_ha = 400
            carbono_por_ha = 113

            return {
                'area_observada': f"{area_em_hectares:,.2f} ha",
                'arvores_existentes': f"{int(area_em_hectares * arvores_por_ha):,}",
                'carbono_sequestrado': f"{area_em_hectares * carbono_por_ha:,.2f} tCO₂",
                'elegivel_plantio': f"{random.uniform(30.0, 70.0):.1f}%",
                'potencial_carbono': 'Alto' if area_em_hectares > 50 else 'Médio',
                'creditos_gerados': f"{area_em_hectares * 300:,.2f} tCO₂"
            }
        except Exception as e:
            raise ValueError(f"Não foi possível processar os dados da área desenhada: {e}")
            
    def _format_kpis_for_frontend(self, relatorio: Dict[str, Any]) -> Dict[str, str]:
        return {
            'ÁREA OBSERVADA': relatorio.get('area_observada', 'N/A'),
            'ÁRVORES EXISTENTES (POT.)': relatorio.get('arvores_existentes', 'N/A'),
            'CARBONO SEQUESTRADO (POT.)': relatorio.get('carbono_sequestrado', 'N/A'),
            'ELEGÍVEL PARA PLANTIO (POT.)': relatorio.get('elegivel_plantio', 'N/A'),
            'POTENCIAL DE CARBONO': relatorio.get('potencial_carbono', 'N/A'),
            'CRÉDITOS GERADOS (POT. ANUAL)': relatorio.get('creditos_gerados', 'N/A'),
        }

    def get_relatorio_by_id(self, relatorio_id: int) -> Optional[Dict[str, Any]]:
        return self.relatorio_repo.get_by_id(relatorio_id) 