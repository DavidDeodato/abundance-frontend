from typing import Dict, Any, Optional, List
from .base_repository import BaseRepository
from psycopg.types.json import Json
import json

class RelatorioRepository(BaseRepository):
    def __init__(self):
        super().__init__('relatorios')

    def create(self, relatorio_data: Dict[str, Any]) -> Dict[str, Any]:
        # Converte o campo geojson para o formato JSON correto
        if 'geojson_area' in relatorio_data and relatorio_data['geojson_area'] is not None:
            relatorio_data['geojson_area'] = Json(relatorio_data['geojson_area'])

        columns = ", ".join(relatorio_data.keys())
        placeholders = ", ".join([f"%({key})s" for key in relatorio_data.keys()])
        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders}) RETURNING *"
        return self._execute_query(query, relatorio_data, fetch='one')

    def get_by_id(self, relatorio_id: int) -> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM {self.table_name} WHERE id = %s"
        return self._execute_query(query, (relatorio_id,), fetch='one') 