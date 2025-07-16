from typing import Dict, Any, Optional, List
from .base_repository import BaseRepository
from psycopg.types.json import Json

class FlorestaRepository(BaseRepository):
    def __init__(self):
        super().__init__('florestas')

    def create(self, floresta_data: Dict[str, Any]) -> Dict[str, Any]:
        for key, value in floresta_data.items():
            if isinstance(value, dict):
                floresta_data[key] = Json(value)
        
        columns = ", ".join(floresta_data.keys())
        placeholders = ", ".join([f"%({key})s" for key in floresta_data.keys()])
        query = f"INSERT INTO {self.table_name} ({columns}) VALUES ({placeholders}) RETURNING *"
        return self._execute_query(query, floresta_data, fetch='one')

    def get_all_for_marketplace(self) -> List[Dict[str, Any]]:
        # Por agora, retorna todos. Mais tarde, podemos filtrar por status.
        query = f"SELECT * FROM {self.table_name} ORDER BY created_at DESC"
        return self._execute_query(query, fetch='all')

    def get_by_id(self, floresta_id: int) -> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM {self.table_name} WHERE id = %s"
        return self._execute_query(query, (floresta_id,), fetch='one') 