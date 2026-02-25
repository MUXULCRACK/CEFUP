from fastapi import HTTPException, status
from . import repository
from . import schemas

def crear_docente_completo(db, docente_in: schemas.DocenteCreate):
    """
    Lógica de negocio para registrar un docente:
    1. Verifica si la persona ya existe por documento[cite: 50, 51].
    2. Si no existe, llama al repository para insertar en 'persona' y luego en 'docente'[cite: 16].
    """
    
    # 1. Validar si ya existe la persona para evitar duplicados
    persona_existente = repository.get_persona_by_documento(
        db, 
        documento=docente_in.numero_documento_identidad
    )
    
    if persona_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una persona registrada con este número de documento."
        )

    # 2. Separar los datos para las dos tablas según el esquema SQL
    datos_persona = {
        "tipo_documento_identidad": docente_in.tipo_documento_identidad,
        "numero_documento_identidad": docente_in.numero_documento_identidad,
        "nombres": docente_in.nombres,
        "apellidos": docente_in.apellidos,
        "fecha_nacimiento": docente_in.fecha_nacimiento,
        "estado_civil": docente_in.estado_civil,
        "pais_residencia": docente_in.pais_residencia,
        "departamento_residencia": docente_in.departamento_residencia,
        "ciudad_residencia": docente_in.ciudad_residencia,
        "direccion": docente_in.direccion,
        "telefono": docente_in.telefono,
        "email": docente_in.email,
        "tipo_sangre": docente_in.tipo_sangre
    }
    
    datos_docente = {
        "ultimo_titulo_profesional": docente_in.ultimo_titulo_profesional,
        "actual_cargo": docente_in.actual_cargo,
        "fecha_contratacion": docente_in.fecha_contratacion
    }

    # 3. Llamar al repositorio para realizar la persistencia (Capa de Acceso a Datos) [cite: 17, 18]
    return repository.create_docente(db, persona_dict=datos_persona, docente_dict=datos_docente)

def obtener_listado_docentes(db, filtro: str = None, skip: int = 0, limit: int = 10, estado: str = "Activo"):
    """
    Lógica para el listado con paginación y filtro.
    Permite filtrar por `estado` (Activo/Inactivo).
    """
    return repository.get_docentes_paginado(db, filtro=filtro, skip=skip, limit=limit, estado=estado)

def reactivar_docente(db, id_persona: int):
    return repository.reactivate_docente(db, id_persona)

def actualizar_docente(db, id_persona: int, persona_data: dict, docente_data: dict):
    return repository.update_docente(db, id_persona, persona_data, docente_data)