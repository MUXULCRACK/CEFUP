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
