from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.core import models

# Importamos los routers (Asegúrate de que los archivos se llamen router.py)
from app.modules.administracion.gestion_docentes.router import router as docentes_router
from app.modules.administracion.gestion_estudiantes.router import router as estudiantes_router
# Asegúrate de importar el OBJETO router, no solo el módulo


# Crear las tablas en MySQL automáticamente

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CEFUP API - Gestión Escolar")

# Configuración de CORS - Vital para que React (puerto 3000) hable con FastAPI (puerto 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], # Esto permite GET, POST, PUT y DELETE
    allow_headers=["*"],
)

# Registro de rutas con el prefijo api/v1
app.include_router(docentes_router, prefix="/api/v1/docentes", tags=["Docentes"])
app.include_router(estudiantes_router, prefix="/api/v1/estudiantes", tags=["Estudiantes"])

@app.get("/")
def home():
    return {"status": "Online", "message": "Servidor CEFUP funcionando con MySQL"}