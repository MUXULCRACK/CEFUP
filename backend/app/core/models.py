from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Boolean, TIMESTAMP, Numeric, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# --- ADMINISTRACIÓN ---

class Persona(Base):
    __tablename__ = "persona"
    id_persona = Column(Integer, primary_key=True, index=True)
    tipo_documento_identidad = Column(String(2), nullable=False)
    numero_documento_identidad = Column(String(20), unique=True, nullable=False)
    nombres = Column(String(50), nullable=False)
    apellidos = Column(String(50), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    estado_civil = Column(String(20))
    pais_residencia = Column(String(100))
    departamento_residencia = Column(String(100))
    ciudad_residencia = Column(String(100))
    direccion = Column(Text)
    telefono = Column(String(20))
    email = Column(String(100))
    tipo_sangre = Column(String(3))
    
    
    # AGREGAR ESTO: Es vital para la desactivación lógica y el historial
    estado = Column(String(20), default="activo") 


    # Relaciones para acceder fácil desde el objeto persona
    usuario = relationship("Usuario", back_populates="persona", uselist=False)
    estudiante = relationship("Estudiante", back_populates="persona", uselist=False)
    docente = relationship("Docente", back_populates="persona", uselist=False)

class Usuario(Base):
    __tablename__ = "usuario"
    id_persona = Column(Integer, ForeignKey("persona.id_persona", ondelete="CASCADE"), primary_key=True)
    login = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    estado = Column(String(10), default="Activo")
    
    persona = relationship("Persona", back_populates="usuario")

# --- PERSONAS (EXTENSIONES) ---

class Estudiante(Base):
    __tablename__ = "estudiante"
    id_persona = Column(Integer, ForeignKey("persona.id_persona", ondelete="CASCADE"), primary_key=True)
    fecha_ingreso = Column(Date)
    alergias = Column(Text)
    condicion_especial = Column(Text)
    observaciones_medicas = Column(Text)

    persona = relationship("Persona", back_populates="estudiante")

class Docente(Base):
    __tablename__ = "docente"
    id_persona = Column(Integer, ForeignKey("persona.id_persona", ondelete="CASCADE"), primary_key=True)
    ultimo_titulo_profesional = Column(String(150))
    actual_cargo = Column(String(100))
    fecha_contratacion = Column(Date)

    persona = relationship("Persona", back_populates="docente")