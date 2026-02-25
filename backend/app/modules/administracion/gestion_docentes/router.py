from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

# Importaciones locales
from app.core.database import get_db
from app.core import models  # <--- IMPORTANTE: Faltaba esta línea para el DELETE
from . import service
from . import schemas

router = APIRouter(
    tags=["Gestión de Docentes"]
)

@router.post("/", response_model=schemas.DocenteResponse, status_code=status.HTTP_201_CREATED)
def crear_docente(docente: schemas.DocenteCreate, db: Session = Depends(get_db)):
    return service.crear_docente_completo(db=db, docente_in=docente)

@router.get("/", response_model=List[schemas.DocenteResponse])
def listar_docentes(
    filtro: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 10, 
    estado: Optional[str] = "Activo",
    db: Session = Depends(get_db)
):
    # El error 500 ocurría porque el service no estaba haciendo el JOIN con Persona
    # Asegúrate de que service.obtener_listado_docentes devuelva objetos completos
    return service.obtener_listado_docentes(db=db, filtro=filtro, skip=skip, limit=limit, estado=estado)

@router.delete("/{id_persona}")
def desactivar_persona(id_persona: int, db: Session = Depends(get_db)):
    db_persona = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).first()
    
    if not db_persona:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    
    db_persona.estado = "Inactivo"
    db.commit()
    
    return {"message": "Registro desactivado y movido al historial"}


@router.post("/{id_persona}/activar")
def reactivar_persona(id_persona: int, db: Session = Depends(get_db)):
    success = service.reactivar_docente(db=db, id_persona=id_persona)
    if not success:
        raise HTTPException(status_code=404, detail="Registro no encontrado o no se pudo reactivar")
    return {"message": "Registro reactivado con éxito"}


@router.put("/{id_persona}")
def actualizar_persona(id_persona: int, payload: dict, db: Session = Depends(get_db)):
    """
    Actualiza los datos de Persona y Docente.
    Se espera un payload plano que contenga los campos de `Persona` y `Docente`.
    """
    # Separar datos (suponemos que cliente envía ambos conjuntos)
    persona_fields = {k: v for k, v in payload.items() if k in [
        'tipo_documento_identidad','numero_documento_identidad','nombres','apellidos','fecha_nacimiento',
        'estado_civil','pais_residencia','departamento_residencia','ciudad_residencia','direccion','telefono','email','tipo_sangre'
    ]}
    docente_fields = {k: v for k, v in payload.items() if k in ['ultimo_titulo_profesional','actual_cargo','fecha_contratacion']}

    updated = service.actualizar_docente(db=db, id_persona=id_persona, persona_data=persona_fields, docente_data=docente_fields)
    if not updated:
        raise HTTPException(status_code=404, detail='Registro no encontrado o no actualizado')
    return updated