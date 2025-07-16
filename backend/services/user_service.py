from typing import Dict, Any, Optional
from repositories.user_repository import UserRepository

class UserService:
    def __init__(self):
        self.user_repo = UserRepository()

    def create_or_get_user_from_mapeie_form(self, user_info: Dict[str, Any]) -> Dict[str, Any]:
        email = user_info.get('email')
        if not email:
            raise ValueError("Email é obrigatório para criar ou buscar usuário.")

        user = self.user_repo.get_by_email(email)
        if user:
            return user

        user_data = {
            "full_name": user_info.get('fullName'),
            "email": email,
            "phone": user_info.get('phone'),
            "profile": user_info.get('profile')
        }
        return self.user_repo.create(user_data)

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        return self.user_repo.get_by_id(user_id) 