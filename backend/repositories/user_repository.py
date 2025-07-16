from typing import Dict, Any, Optional
from .base_repository import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__('users')

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM {self.table_name} WHERE email = %s"
        return self._execute_query(query, (email,), fetch='one')

    def get_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM {self.table_name} WHERE id = %s"
        return self._execute_query(query, (user_id,), fetch='one')

    def create(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        query = f"""
            INSERT INTO {self.table_name} (full_name, email, phone, profile)
            VALUES (%(full_name)s, %(email)s, %(phone)s, %(profile)s)
            RETURNING *;
        """
        result = self._execute_query(query, user_data, fetch='one')
        return result 