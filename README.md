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
- Git
- MySQL 8+ solo si quieres usar esa base en lugar de SQLite

## 2) Primer arranque desde cero

Si alguien clona el repositorio desde cero, no necesita preparar MySQL para levantar el proyecto en desarrollo.
El backend usa SQLite por defecto y crea la base local automáticamente en `backend/cefup_dev.db`.

Los datos de docentes se cargan solos al iniciar la API si la base está vacía.

## 3) Levantar backend (FastAPI)

Desde la raíz del proyecto o desde `backend/`:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" sqlalchemy pymysql
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend disponible en:

 - API: http://localhost:8000
 - Docs Swagger: http://localhost:8000/docs

## 4) Levantar frontend (React)

Desde `frontend/`:

```bash
cd frontend
npm install
npm start
```

Frontend disponible en:

- http://localhost:3000

## 5) Uso opcional con MySQL

Si quieres usar MySQL en vez de SQLite, exporta estas variables antes de arrancar el backend:

```bash
export DB_DRIVER=mysql
export DB_USER=cefup
export DB_PASSWORD=cefup123
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=cefup_db
```

Luego crea la base y carga el script SQL manualmente.

## 6) Orden recomendado

1. Inicia el backend.
2. Inicia el frontend.
3. Abre http://localhost:3000
