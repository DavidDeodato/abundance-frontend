from typing import Dict, Any, Optional
from .base_repository import BaseRepository
from psycopg.types.json import Json
import json

class ProjecaoRepository(BaseRepository):
    def __init__(self):
        super().__init__('projecoes')

    def create(self, projecao_data: Dict[str, Any]) -> Dict[str, Any]:
        # Converte todos os campos que são dicionários para o formato JSON
        for key, value in projecao_data.items():
            if isinstance(value, dict):
                projecao_data[key] = Json(value)

        columns = ", ".join(projecao_data.keys())
        placeholders = ", ".join([f"%({key})s" for key in projecao_data.keys()])
        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders}) RETURNING *"
        return self._execute_query(query, projecao_data, fetch='one')

    def get_by_relatorio_id(self, relatorio_id: int) -> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM {self.table_name} WHERE relatorio_id = %s"
        return self._execute_query(query, (relatorio_id,), fetch='one') 