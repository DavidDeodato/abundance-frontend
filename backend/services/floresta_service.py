from typing import Dict, Any
from repositories.floresta_repository import FlorestaRepository

class FlorestaService:
    def __init__(self):
        self.floresta_repo = FlorestaRepository()

    def create_floresta(self, floresta_data: Dict[str, Any]) -> Dict[str, Any]:
        # Validações podem ser adicionadas aqui
        return self.floresta_repo.create(floresta_data)

    def get_all_for_marketplace(self):
        return self.floresta_repo.get_all_for_marketplace() 