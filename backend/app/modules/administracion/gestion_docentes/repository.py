from sqlalchemy.orm import Session
from app.core import models
from typing import Optional

def get_persona_by_documento(db: Session, documento: str):
    return db.query(models.Persona).filter(
        models.Persona.numero_documento_identidad == documento
    ).first()

def create_docente(db: Session, persona_dict: dict, docente_dict: dict):
    try:
        nueva_persona = models.Persona(**persona_dict)
        db.add(nueva_persona)
        db.flush() 

        nuevo_docente = models.Docente(
            id_persona=nueva_persona.id_persona, 
            **docente_dict
        )
        db.add(nuevo_docente)
        
        db.commit()
        # Refrescar ambas entidades para asegurarnos de tener los datos completos
        db.refresh(nueva_persona)
        db.refresh(nuevo_docente)

        # Construir un dict que combine los campos de Persona y Docente
        persona = nueva_persona
        docente = nuevo_docente
        merged = {
            "id_persona": persona.id_persona,
            "estado": persona.estado,
            "tipo_documento_identidad": persona.tipo_documento_identidad,
            "numero_documento_identidad": persona.numero_documento_identidad,
            "nombres": persona.nombres,
            "apellidos": persona.apellidos,
            "fecha_nacimiento": persona.fecha_nacimiento,
            "estado_civil": persona.estado_civil,
            "pais_residencia": persona.pais_residencia,
            "departamento_residencia": persona.departamento_residencia,
            "ciudad_residencia": persona.ciudad_residencia,
            "direccion": persona.direccion,
            "telefono": persona.telefono,
            "email": persona.email,
            "tipo_sangre": persona.tipo_sangre,
            "ultimo_titulo_profesional": docente.ultimo_titulo_profesional,
            "actual_cargo": docente.actual_cargo,
            "fecha_contratacion": docente.fecha_contratacion
        }

        return merged
        
    except Exception as e:
        db.rollback()
        raise e

def get_docentes_paginado(db: Session, filtro: Optional[str] = None, skip: int = 0, limit: int = 10, estado: Optional[str] = "Activo"):
    """
    Consulta con JOIN. 
    FILTRO CRÍTICO: Solo personas con estado 'Activo'.
    """
    # Iniciamos la consulta uniendo ambas tablas
    query = db.query(models.Docente).join(models.Persona)
    
    # Filtro por estado (Activo / Inactivo) — case-insensitive
    if estado:
        query = query.filter(models.Persona.estado.ilike(estado))
    
    if filtro:
        search = f"%{filtro}%"
        query = query.filter(
            (models.Persona.numero_documento_identidad.ilike(search)) |
            (models.Persona.nombres.ilike(search)) |
            (models.Persona.apellidos.ilike(search))
        )
    
    results = query.offset(skip).limit(limit).all()

    merged_list = []
    for docente in results:
        persona = docente.persona
        merged = {
            "id_persona": persona.id_persona,
            "estado": persona.estado,
            "tipo_documento_identidad": persona.tipo_documento_identidad,
            "numero_documento_identidad": persona.numero_documento_identidad,
            "nombres": persona.nombres,
            "apellidos": persona.apellidos,
            "fecha_nacimiento": persona.fecha_nacimiento,
            "estado_civil": persona.estado_civil,
            "pais_residencia": persona.pais_residencia,
            "departamento_residencia": persona.departamento_residencia,
            "ciudad_residencia": persona.ciudad_residencia,
            "direccion": persona.direccion,
            "telefono": persona.telefono,
            "email": persona.email,
            "tipo_sangre": persona.tipo_sangre,
            "ultimo_titulo_profesional": docente.ultimo_titulo_profesional,
            "actual_cargo": docente.actual_cargo,
            "fecha_contratacion": docente.fecha_contratacion
        }
        merged_list.append(merged)

    return merged_list

def reactivate_docente(db: Session, id_persona: int):
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

def update_docente(db: Session, id_persona: int, persona_data: dict, docente_data: dict):
    try:
        # Actualiza Persona
        persona_upd = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).update(persona_data)
        # Actualiza Docente
        db.query(models.Docente).filter(models.Docente.id_persona == id_persona).update(docente_data)

        if persona_upd == 0:
            db.rollback()
            return None

        db.commit()
        # Retornar objeto combinado
        docente = db.query(models.Docente).join(models.Persona).filter(models.Persona.id_persona == id_persona).first()
        if not docente:
            return None
        persona = docente.persona
        merged = {
            "id_persona": persona.id_persona,
            "tipo_documento_identidad": persona.tipo_documento_identidad,
            "numero_documento_identidad": persona.numero_documento_identidad,
            "nombres": persona.nombres,
            "apellidos": persona.apellidos,
            "fecha_nacimiento": persona.fecha_nacimiento,
            "estado_civil": persona.estado_civil,
            "pais_residencia": persona.pais_residencia,
            "departamento_residencia": persona.departamento_residencia,
            "ciudad_residencia": persona.ciudad_residencia,
            "direccion": persona.direccion,
            "telefono": persona.telefono,
            "email": persona.email,
            "tipo_sangre": persona.tipo_sangre,
            "ultimo_titulo_profesional": docente.ultimo_titulo_profesional,
            "actual_cargo": docente.actual_cargo,
            "fecha_contratacion": docente.fecha_contratacion
        }
        return merged
    except Exception as e:
        db.rollback()
        raise e