from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime, date

# --- Pydantic Schemas (para validação de dados da API) ---

# User Schemas
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    profile: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

class UserInfoData(BaseModel):
    fullName: str
    email: EmailStr
    phone: Optional[str] = None
    profile: Optional[str] = None

# Relatorio Schemas
class RelatorioBase(BaseModel):
    user_id: int
    address: Optional[str] = None
    selected_area_name: Optional[str] = None
    geojson_area: Optional[Dict[str, Any]] = None
    area_observada: Optional[str] = None
    arvores_existentes: Optional[str] = None
    carbono_sequestrado: Optional[str] = None
    elegivel_plantio: Optional[str] = None
    potencial_carbono: Optional[str] = None
    creditos_gerados: Optional[str] = None
    user_full_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    user_profile: Optional[str] = None

class RelatorioCreate(RelatorioBase):
    pass

class Relatorio(RelatorioBase):
    id: int
    created_at: datetime

# Projecao Schemas
class ProjecaoBase(BaseModel):
    relatorio_id: int
    sumario_executivo: Optional[Dict[str, Any]] = None
    fatos_car: Optional[Dict[str, Any]] = None
    capex_estimado: Optional[Dict[str, Any]] = None
    receitas_medias: Optional[Dict[str, Any]] = None
    roadmap: Optional[Dict[str, Any]] = None
    riscos_mitigacoes: Optional[Dict[str, Any]] = None

class ProjecaoCreate(ProjecaoBase):
    pass

class Projecao(ProjecaoBase):
    id: int
    created_at: datetime

# Floresta Schemas
class FlorestaBase(BaseModel):
    user_id: int
    relatorio_id: int
    projecao_id: int
    # ... (outros campos)

class FlorestaCreate(FlorestaBase):
    pass

class Floresta(FlorestaBase):
    id: int
    created_at: datetime

# --- Schemas para Flows Específicos ---
class MapeieTerraInput(BaseModel):
    address: Optional[str] = None
    selectedAreaName: str
    userInfo: UserInfoData
    geojson: Optional[Dict[str, Any]] = None

class MapeieTerraResponse(BaseModel):
    success: bool
    relatorio_id: int
    user_id: int
    kpis: Dict[str, str]
    message: str

class AvalieTerraResponse(BaseModel):
    projecao_id: int
    sumario_executivo: Dict[str, Any]
    fatos_car: Dict[str, Any]
    capex_estimado: Dict[str, Any]
    receitas_medias: Dict[str, Any]
    roadmap: Dict[str, Any]
    riscos_mitigacoes: Dict[str, Any] 