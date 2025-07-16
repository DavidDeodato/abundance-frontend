import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, close_db, create_tables
from routers import users, relatorios, projecoes, florestas

# App Initialization
app = FastAPI(
    title="Abundance Brasil Backend",
    description="API para a plataforma Abundance Brasil",
    version="0.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and Shutdown Events
@app.on_event("startup")
def on_startup():
    print("🚀 Starting Abundance Brasil Backend...")
    init_db()
    create_tables()
    print("✅ Database initialized successfully")

@app.on_event("shutdown")
def on_shutdown():
    print("👋 Shutting down Abundance Brasil Backend...")
    close_db()

# API Routers
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(relatorios.router, prefix="/api/relatorios", tags=["Relatorios"])
app.include_router(projecoes.router, prefix="/api/projecoes", tags=["Projecoes"])
app.include_router(florestas.router, prefix="/api/florestas", tags=["Florestas"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Abundance Brasil API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 