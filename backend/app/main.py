from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

from app.core.database import engine, SessionLocal
from app.core import models

# Importamos los routers (Asegúrate de que los archivos se llamen router.py)
from app.modules.administracion.gestion_docentes.router import router as docentes_router
from app.modules.administracion.gestion_estudiantes.router import router as estudiantes_router
# Asegúrate de importar el OBJETO router, no solo el módulo


# Crear las tablas automáticamente

models.Base.metadata.create_all(bind=engine)


def seed_docentes_if_empty():
    db = SessionLocal()
    try:
        existing = db.query(models.Docente).count()
        if existing > 0:
            return

        personas = [
            models.Persona(
                estado="Activo",
                tipo_documento_identidad="CC",
                numero_documento_identidad="101001001",
                nombres="Carlos Andres",
                apellidos="Ramirez Gomez",
                fecha_nacimiento=date(1985, 6, 12),
                estado_civil="Casado",
                pais_residencia="Colombia",
                departamento_residencia="Cundinamarca",
                ciudad_residencia="Bogota",
                direccion="Calle 10 #20-30",
                telefono="3001112233",
                email="carlos.ramirez@cefup.edu.co",
                tipo_sangre="O+",
            ),
            models.Persona(
                estado="Activo",
                tipo_documento_identidad="CC",
                numero_documento_identidad="101001002",
                nombres="Laura Marcela",
                apellidos="Pineda Torres",
                fecha_nacimiento=date(1990, 3, 8),
                estado_civil="Soltero",
                pais_residencia="Colombia",
                departamento_residencia="Antioquia",
                ciudad_residencia="Medellin",
                direccion="Carrera 45 #12-90",
                telefono="3002223344",
                email="laura.pineda@cefup.edu.co",
                tipo_sangre="A+",
            ),
            models.Persona(
                estado="Activo",
                tipo_documento_identidad="CC",
                numero_documento_identidad="101001003",
                nombres="Jorge Ivan",
                apellidos="Moreno Diaz",
                fecha_nacimiento=date(1982, 11, 23),
                estado_civil="Union Libre",
                pais_residencia="Colombia",
                departamento_residencia="Valle del Cauca",
                ciudad_residencia="Cali",
                direccion="Avenida 5 #33-44",
                telefono="3003334455",
                email="jorge.moreno@cefup.edu.co",
                tipo_sangre="B+",
            ),
        ]

        db.add_all(personas)
        db.flush()

        docentes = [
            models.Docente(
                id_persona=personas[0].id_persona,
                ultimo_titulo_profesional="Licenciatura en Matematicas",
                actual_cargo="Docente de Matematicas",
                fecha_contratacion=date(2021, 1, 18),
            ),
            models.Docente(
                id_persona=personas[1].id_persona,
                ultimo_titulo_profesional="Licenciatura en Lengua Castellana",
                actual_cargo="Docente de Lenguaje",
                fecha_contratacion=date(2022, 2, 1),
            ),
            models.Docente(
                id_persona=personas[2].id_persona,
                ultimo_titulo_profesional="Licenciatura en Ciencias Sociales",
                actual_cargo="Docente de Sociales",
                fecha_contratacion=date(2020, 7, 15),
            ),
        ]

        db.add_all(docentes)
        db.commit()
    finally:
        db.close()

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


@app.on_event("startup")
def startup_seed():
    seed_docentes_if_empty()

@app.get("/")
def home():
    return {"status": "Online", "message": "Servidor CEFUP funcionando"}