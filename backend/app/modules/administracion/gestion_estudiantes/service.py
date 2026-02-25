from . import repository
from fastapi import HTTPException

def registrar_estudiante(db, datos_in):
    datos_completos = datos_in.dict()
    
    # Definimos qué campos se van a la tabla estudiante
    campos_estudiante = {'fecha_ingreso', 'alergias', 'condicion_especial', 'observaciones_medicas'}
    
    persona_data = {k: v for k, v in datos_completos.items() if k not in campos_estudiante}
    estudiante_data = {k: v for k, v in datos_completos.items() if k in campos_estudiante}
    
    # Aseguramos que el estado sea 'activo' al crear
    persona_data['estado'] = "activo"
    
    return repository.create_estudiante(db, persona_data, estudiante_data)

def obtener_listado_estudiantes(db, filtro, skip, limit, estado: str = "Activo"):
    """
    Lógica para el listado con paginación y filtro.
    El parámetro `estado` permite solicitar estudiantes activos o inactivos.
    """
    return repository.get_estudiantes(db, filtro=filtro, skip=skip, limit=limit, estado=estado)

def actualizar_estudiante(db, id_persona, datos_in):
    datos_completos = datos_in.dict(exclude_unset=True)
    
    campos_estudiante = {'fecha_ingreso', 'alergias', 'condicion_especial', 'observaciones_medicas'}
    
    persona_data = {k: v for k, v in datos_completos.items() if k not in campos_estudiante}
    estudiante_data = {k: v for k, v in datos_completos.items() if k in campos_estudiante}
    
    return repository.update_estudiante(db, id_persona, persona_data, estudiante_data)

def eliminar_logico(db, id_persona):
    """
    Sincronizado con el nombre en el router
    """
    return repository.soft_delete_estudiante(db, id_persona)

def reactivar_estudiante(db, id_persona):
    """
    Reactiva una persona/estudiante cambiando su estado a 'Activo'.
    """
    return repository.reactivate_estudiante(db, id_persona)