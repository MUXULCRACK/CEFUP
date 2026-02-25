from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class DocenteBase(BaseModel):
    # Datos de Persona
    tipo_documento_identidad: str # CC, TI, etc.
    numero_documento_identidad: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    estado_civil: Optional[str] = None
    pais_residencia: Optional[str] = None
    departamento_residencia: Optional[str] = None
    ciudad_residencia: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    tipo_sangre: Optional[str] = None
    
    # Datos de Docente
    ultimo_titulo_profesional: Optional[str] = None
    actual_cargo: Optional[str] = "Docente"
    fecha_contratacion: Optional[date] = None

class DocenteCreate(DocenteBase):
    pass # Usado para el POST

class DocenteResponse(DocenteBase):
    id_persona: int
    class Config:
        orm_mode = True