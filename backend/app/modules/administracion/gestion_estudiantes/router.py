from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core import models 
from . import service
from . import schemas

router = APIRouter()

@router.post("/", response_model=schemas.EstudianteResponse, status_code=status.HTTP_201_CREATED)
def crear_estudiante(estudiante: schemas.EstudianteCreate, db: Session = Depends(get_db)):
    return service.registrar_estudiante(db=db, datos_in=estudiante)

@router.get("/", response_model=List[schemas.EstudianteResponse])
def listar_estudiantes(
    filtro: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 10, 
    estado: Optional[str] = "Activo",
    db: Session = Depends(get_db)
):
    # Esta función ahora devolverá el objeto Persona + Estudiante completo
    return service.obtener_listado_estudiantes(db=db, filtro=filtro, skip=skip, limit=limit, estado=estado)

@router.put("/{id_persona}", response_model=schemas.EstudianteResponse)
def actualizar_estudiante(
    id_persona: int, 
    estudiante: schemas.EstudianteCreate, 
    db: Session = Depends(get_db)
):
    db_estudiante = service.actualizar_estudiante(db=db, id_persona=id_persona, datos_in=estudiante)
    if not db_estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado para actualizar")
    return db_estudiante

@router.delete("/{id_persona}")
def desactivar_persona(id_persona: int, db: Session = Depends(get_db)):
    db_persona = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).first()
    if not db_persona:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    
    db_persona.estado = "Inactivo"
    db.commit()
    return {"message": "Registro desactivado con éxito"}


@router.post("/{id_persona}/activar")
def reactivar_persona(id_persona: int, db: Session = Depends(get_db)):
    """
    Reactiva una persona (cambia estado a 'Activo').
    """
    success = service.reactivar_estudiante(db=db, id_persona=id_persona)
    if not success:
        raise HTTPException(status_code=404, detail="Registro no encontrado o no se pudo reactivar")
    return {"message": "Registro reactivado con éxito"}