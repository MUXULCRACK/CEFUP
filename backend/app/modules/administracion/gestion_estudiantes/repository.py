from sqlalchemy.orm import Session
from app.core import models
from typing import Optional

def create_estudiante(db: Session, persona_data: dict, estudiante_data: dict):
    try:
        # 1. Crear la Persona
        nueva_persona = models.Persona(**persona_data)
        db.add(nueva_persona)
        db.flush() # flush() es mejor que commit() aquí para mantener la transacción abierta
        
        # 2. Crear el Estudiante
        nuevo_estudiante = models.Estudiante(
            id_persona=nueva_persona.id_persona,
            **estudiante_data
        )
        db.add(nuevo_estudiante)
        db.commit()
        db.refresh(nueva_persona)
        return nueva_persona
    except Exception as e:
        db.rollback()
        raise e

def get_estudiantes(db: Session, filtro: Optional[str] = None, skip: int = 0, limit: int = 10, estado: Optional[str] = "Activo"):
    """
    Obtiene estudiantes (filtrando por `estado`) aplanando los datos de Persona y Estudiante.
    Devuelve una lista de diccionarios combinando campos de ambas tablas.
    """
    # ✅ Seleccionamos las columnas de AMBAS tablas
    query = db.query(
        models.Persona.id_persona,
        models.Persona.tipo_documento_identidad,
        models.Persona.numero_documento_identidad,
        models.Persona.nombres,
        models.Persona.apellidos,
        models.Persona.fecha_nacimiento,
        models.Persona.email,
        models.Persona.telefono,
        models.Persona.estado,
        models.Estudiante.fecha_ingreso,
        models.Estudiante.alergias,
        models.Estudiante.condicion_especial,
        models.Estudiante.observaciones_medicas
    ).join(models.Estudiante, models.Persona.id_persona == models.Estudiante.id_persona)
    
    # Filtro por estado (por ejemplo 'Activo' o 'Inactivo') — case-insensitive
    if estado:
        query = query.filter(models.Persona.estado.ilike(estado))
    
    if filtro:
        search = f"%{filtro}%"
        query = query.filter(
            (models.Persona.nombres.ilike(search)) |
            (models.Persona.apellidos.ilike(search)) |
            (models.Persona.numero_documento_identidad.ilike(search))
        )
    
    return query.offset(skip).limit(limit).all()

def update_estudiante(db: Session, id_persona: int, persona_data: dict, estudiante_data: dict):
    try:
        # Actualización atómica en Persona
        persona_upd = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).update(persona_data)
        
        # Actualización atómica en Estudiante
        db.query(models.Estudiante).filter(models.Estudiante.id_persona == id_persona).update(estudiante_data)
        
        if persona_upd == 0:
            db.rollback()
            return None

        db.commit()
        # Retornamos la persona actualizada (puedes volver a consultar para traer el objeto completo)
        return db.query(models.Persona).filter(models.Persona.id_persona == id_persona).first()
    except Exception as e:
        db.rollback()
        raise e

def soft_delete_estudiante(db: Session, id_persona: int):
    try:
        db_persona = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).first()
        if db_persona:
            db_persona.estado = "Inactivo"
            db.commit()
            return True
        return False
    except Exception as e:
        db.rollback()
        raise e

def reactivate_estudiante(db: Session, id_persona: int):
    try:
        db_persona = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).first()
        if db_persona:
            db_persona.estado = "Activo"
            db.commit()
            return True
        return False
    except Exception as e:
        db.rollback()
        raise e