from fastapi import FastAPI
from app.core.database import engine
from app.core import models
from app.modules.administracion.gestion_docentes import router as docentes_router
from app.modules.administracion.gestion_estudiantes import router as estudiantes_router

# Esta línea crea físicamente las tablas en el archivo .db si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema CEFUP")

# Registrar los módulos que hemos creado
app.include_router(docentes_router.router)
app.include_router(estudiantes_router.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido al Sistema de Gestión Escolar CEFUP"}