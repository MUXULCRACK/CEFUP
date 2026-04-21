# Entregables comprimidos

Se generan dos archivos ZIP al mismo nivel de este README:

- **gestion-estudiantes.zip**: contiene frontend y backend del módulo estudiantes
  - `frontend/src/modules/administracion/gestion-estudiantes/`
  - `backend/app/modules/administracion/gestion_estudiantes/`

- **gestion-docentes.zip**: contiene frontend y backend del módulo docentes
  - `frontend/src/modules/administracion/gestion-docentes/`
  - `backend/app/modules/administracion/gestion_docentes/`

Comando usado para generarlos:

```bash
zip -r gestion-estudiantes.zip \
  frontend/src/modules/administracion/gestion-estudiantes \
  backend/app/modules/administracion/gestion_estudiantes

zip -r gestion-docentes.zip \
  frontend/src/modules/administracion/gestion-docentes \
  backend/app/modules/administracion/gestion_docentes
```

# Como correr el proyecto

## 1) Requisitos

- Python 3.10+
- Node.js 18+ y npm
- MySQL 8+

## 2) Base de datos

1. Crear la base de datos `cefup_db` en MySQL.
2. Ejecutar el script SQL base:

```bash
mysql -u root -p cefup_db < database/base.sql
```

> Nota: la conexion del backend esta configurada en `backend/app/core/database.py` como:
> `mysql+pymysql://root@localhost:3306/cefup_db`
> Ajusta usuario, password o host segun tu entorno.

## 3) Levantar backend (FastAPI)

Desde la carpeta `backend/`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" sqlalchemy pymysql
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend disponible en:

- API: http://localhost:8000
- Docs Swagger: http://localhost:8000/docs

## 4) Levantar frontend (React)

Desde la carpeta `frontend/`:

```bash
npm install
npm start
```

Frontend disponible en:

- http://localhost:3000

## 5) Orden recomendado

1. Inicia MySQL.
2. Inicia backend.
3. Inicia frontend.
