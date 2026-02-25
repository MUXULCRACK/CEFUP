from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date
from typing import Optional

class EstudianteBase(BaseModel):
    
    # Datos de Persona
    tipo_documento_identidad: str
    numero_documento_identidad: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    estado_civil: Optional[str] = "Soltero"
    pais_residencia: Optional[str] = "Colombia"
    departamento_residencia: Optional[str] = None
    ciudad_residencia: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    tipo_sangre: Optional[str] = "O+"
    # IMPORTANTE: Añadir estado para que el frontend sepa si está activo
    estado: Optional[str] = "activo"
    
    # Datos de Estudiante
    fecha_ingreso: Optional[date] = None
    alergias: Optional[str] = None
    condicion_especial: Optional[str] = None
    observaciones_medicas: Optional[str] = None

class EstudianteCreate(EstudianteBase):
    pass

class EstudianteResponse(EstudianteBase):
    id_persona: int
    
    # En Pydantic V2 se usa model_config en lugar de class Config
    model_config = ConfigDict(from_attributes=True)