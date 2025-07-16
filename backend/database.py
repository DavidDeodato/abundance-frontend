import os
import psycopg
from psycopg_pool import ConnectionPool
from typing import Optional
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env.
# Garanta que o arquivo .env esteja salvo com a codificação UTF-8.
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://david_abundance_teste_user:L8prL8FFxbmP68WelgSaazA2vjtc4g2j@dpg-d1midfili9vc739l5kc0-a.oregon-postgres.render.com/david_abundance_teste"
)

pool: Optional[ConnectionPool] = None

def init_db():
    global pool
    if pool is None:
        try:
            pool = ConnectionPool(DATABASE_URL, min_size=1, max_size=10, open=True)
            print(f"Database pool initialized: {DATABASE_URL.split('@')[-1]}")
        except Exception as e:
            print(f"Failed to initialize database pool: {e}")
            raise

def get_connection():
    if pool is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return pool.connection()

def close_db():
    global pool
    if pool:
        pool.close()
        pool = None
        print("Database pool closed")

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    profile VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS relatorios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    address TEXT,
    selected_area_name VARCHAR(255),
    area_observada VARCHAR(50),
    arvores_existentes VARCHAR(50),
    carbono_sequestrado VARCHAR(50),
    elegivel_plantio VARCHAR(50),
    potencial_carbono VARCHAR(50),
    creditos_gerados VARCHAR(50),
    user_full_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(50),
    user_profile VARCHAR(100),
    geojson_area JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS projecoes (
    id SERIAL PRIMARY KEY,
    relatorio_id INTEGER REFERENCES relatorios(id),
    sumario_executivo JSONB,
    fatos_car JSONB,
    capex_estimado JSONB,
    receitas_medias JSONB,
    roadmap JSONB,
    riscos_mitigacoes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS florestas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    relatorio_id INTEGER REFERENCES relatorios(id),
    projecao_id INTEGER REFERENCES projecoes(id),
    nome_projeto VARCHAR(255),
    descricao_projeto TEXT,
    tipo_projeto VARCHAR(100),
    objetivo_principal VARCHAR(100),
    estado VARCHAR(50),
    cidade VARCHAR(100),
    endereco_completo TEXT,
    codigo_car VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    area_total_ha DECIMAL(10,2),
    bioma VARCHAR(100),
    especies_nativas JSONB,
    data_plantio DATE,
    numero_arvores INTEGER,
    densidade_arvores_ha INTEGER,
    metodologia_carbono VARCHAR(100),
    certificacoes JSONB,
    responsavel_tecnico VARCHAR(255),
    cronograma_monitoramento VARCHAR(100),
    frequencia_monitoramento VARCHAR(100),
    comunidade_local_envolvida TEXT,
    beneficios_sociais JSONB,
    empregos_gerados_estimativa INTEGER,
    documentos_projeto JSONB,
    fotos_area JSONB,
    aceita_termos BOOLEAN DEFAULT FALSE,
    status_marketplace VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
"""

def create_tables():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(CREATE_TABLES_SQL)
            conn.commit()
    print("Database tables created/verified successfully") 