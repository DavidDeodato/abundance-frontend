from database import get_connection
from psycopg.rows import dict_row

class BaseRepository:
    def __init__(self, table_name: str):
        self.table_name = table_name

    def _execute_query(self, query: str, params=None, fetch=None):
        with get_connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(query, params)
                
                if fetch == 'one':
                    return cur.fetchone()
                if fetch == 'all':
                    return cur.fetchall()
                
                # Para operações de INSERT, UPDATE, DELETE que não retornam nada,
                # precisamos de fazer o commit.
                conn.commit()
                return None 