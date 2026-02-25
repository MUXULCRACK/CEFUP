-- =========================
-- ADMINISTRACIÓN
-- =========================

CREATE TABLE persona (
    id_persona SERIAL PRIMARY KEY,
    tipo_documento_identidad VARCHAR(2) NOT NULL CHECK (tipo_documento_identidad IN ('CC','TI','CE','PA')),
    numero_documento_identidad VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    estado_civil VARCHAR(20) CHECK (estado_civil IN ('Soltero','Casado','Union Libre','Divorciado','Viudo')),
    pais_residencia VARCHAR(100),
    departamento_residencia VARCHAR(100),
    ciudad_residencia VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    tipo_sangre VARCHAR(3) CHECK (tipo_sangre IN ('A+','A-','B+','B-','O+','O-','AB+','AB-'))
);

CREATE TABLE usuario (
    id_persona INT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    estado VARCHAR(10) DEFAULT 'Activo' CHECK (estado IN ('Activo','Inactivo')),
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE
);

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE usuario_rol (
    id_persona INT,
    id_rol INT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_persona, id_rol),
    FOREIGN KEY (id_persona) REFERENCES usuario(id_persona) ON DELETE SET NULL,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE SET NULL
);

CREATE TABLE modulo (
    id_modulo SERIAL PRIMARY KEY,
    nombre_corto_modulo VARCHAR(20) NOT NULL UNIQUE,
    nombre_modulo VARCHAR(100),
    descripcion_modulo TEXT
);

CREATE TABLE funcionalidad (
    id_funcionalidad SERIAL PRIMARY KEY,
    nombre_corto_funcionalidad VARCHAR(20) NOT NULL UNIQUE,
    nombre_funcionalidad VARCHAR(100),
    descripcion_funcionalidad TEXT,
    id_modulo INT,
    ruta VARCHAR(50),
    FOREIGN KEY (id_modulo) REFERENCES modulo(id_modulo) ON DELETE SET NULL
);

CREATE TABLE rol_funcionalidad (
    id_rol INT,
    id_funcionalidad INT,
    PRIMARY KEY (id_rol, id_funcionalidad),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE SET NULL,
    FOREIGN KEY (id_funcionalidad) REFERENCES funcionalidad(id_funcionalidad) ON DELETE SET NULL
);

-- =========================
-- PERSONAS
-- =========================

CREATE TABLE estudiante (
    id_persona INT PRIMARY KEY,
    fecha_ingreso DATE,
    alergias TEXT,
    condicion_especial TEXT,
    observaciones_medicas TEXT,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE
);

CREATE TABLE docente (
    id_persona INT PRIMARY KEY,
    ultimo_titulo_profesional VARCHAR(150),
    actual_cargo VARCHAR(100),
    fecha_contratacion DATE,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE
);

-- =========================
-- ESTRUCTURA ACADÉMICA
-- =========================

CREATE TABLE nivel (
    id_nivel INT PRIMARY KEY,
    nombre_nivel VARCHAR(100) NOT NULL,
    descripcion_nivel TEXT
);

CREATE TABLE grado (
    id_grado INT PRIMARY KEY,
    id_nivel INT,
    nombre_grado VARCHAR(50) NOT NULL,
    descripcion_grado TEXT,
    FOREIGN KEY (id_nivel) REFERENCES nivel(id_nivel) ON DELETE SET NULL
);

CREATE TABLE area (
    id_area SERIAL PRIMARY KEY,
    id_grado INT,
    nombre_area VARCHAR(100) NOT NULL,
    descripcion_area TEXT,
    FOREIGN KEY (id_grado) REFERENCES grado(id_grado) ON DELETE SET NULL
);

CREATE TABLE asignatura (
    id_asignatura INT PRIMARY KEY,
    id_area INT,
    nombre_asignatura VARCHAR(100) NOT NULL,
    descripcion_asignatura TEXT,
    ihs INT,
    FOREIGN KEY (id_area) REFERENCES area(id_area) ON DELETE SET NULL
);

CREATE TABLE desempenio (
    id_desempenio SERIAL PRIMARY KEY,
    id_asignatura INT,
    descripcion_desempenio TEXT NOT NULL,
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura) ON DELETE SET NULL
);

-- =========================
-- AÑO, PERIODOS, GRUPOS
-- =========================

CREATE TABLE anio_escolar (
    id_anio_escolar SERIAL PRIMARY KEY,
    es_anio_actual BOOLEAN,
    fecha_inicio DATE,
    fecha_fin DATE
);

CREATE TABLE periodo (
    id_periodo SERIAL PRIMARY KEY,
    id_anio_escolar INT,
    orden_periodo INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (id_anio_escolar) REFERENCES anio_escolar(id_anio_escolar) ON DELETE SET NULL
);

CREATE TABLE vinculacion_docente (
    id_anio_escolar INT,
    id_persona INT,
    fecha_vinculacion DATE,
    PRIMARY KEY (id_anio_escolar, id_persona),
    FOREIGN KEY (id_anio_escolar) REFERENCES anio_escolar(id_anio_escolar) ON DELETE SET NULL,
    FOREIGN KEY (id_persona) REFERENCES docente(id_persona) ON DELETE SET NULL
);

CREATE TABLE grupo (
    id_grupo SERIAL PRIMARY KEY,
    id_grado INT,
    id_docente_titular INT,
    id_anio_escolar INT,
    nombre_grupo VARCHAR(5) NOT NULL,
    FOREIGN KEY (id_grado) REFERENCES grado(id_grado) ON DELETE SET NULL,
    FOREIGN KEY (id_docente_titular) REFERENCES docente(id_persona) ON DELETE SET NULL,
    FOREIGN KEY (id_anio_escolar) REFERENCES anio_escolar(id_anio_escolar) ON DELETE SET NULL
);

CREATE TABLE grupo_asignatura (
    id_grupo_asignatura SERIAL PRIMARY KEY,
    id_grupo INT NOT NULL,
    id_asignatura INT NOT NULL,
    id_docente INT,
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE SET NULL,
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura) ON DELETE SET NULL,
    FOREIGN KEY (id_docente) REFERENCES docente(id_persona) ON DELETE SET NULL,
    UNIQUE(id_grupo, id_asignatura)
);

CREATE TABLE matricula (
    id_matricula SERIAL PRIMARY KEY,
    id_estudiante INT,
    id_grupo INT,
    id_anio_escolar INT,
    fecha_matricula DATE NOT NULL,
    estado VARCHAR(10) DEFAULT 'Activa' CHECK (estado IN ('Activa','Cancelada','Finalizada')),
    FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_persona) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE SET NULL,
    FOREIGN KEY (id_anio_escolar) REFERENCES anio_escolar(id_anio_escolar) ON DELETE SET NULL
);

CREATE TABLE desempenio_grupo_periodo (
    id_desempenio INT,
    id_grupo INT,
    id_periodo INT,
    FOREIGN KEY (id_desempenio) REFERENCES desempenio(id_desempenio) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE SET NULL,
    FOREIGN KEY (id_periodo) REFERENCES periodo(id_periodo) ON DELETE SET NULL
);

-- =========================
-- NOTAS Y CONDUCTA
-- =========================

CREATE TABLE nota (
    id_nota SERIAL PRIMARY KEY,
    id_matricula INT,
    id_asignatura INT,
    id_periodo INT,
    valor DECIMAL(4,2) NOT NULL,
    observacion_nota TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_matricula) REFERENCES matricula(id_matricula) ON DELETE SET NULL,
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura) ON DELETE SET NULL,
    FOREIGN KEY (id_periodo) REFERENCES periodo(id_periodo) ON DELETE SET NULL
);

CREATE TABLE conducta (
    id_conducta SERIAL PRIMARY KEY,
    id_matricula INT,
    id_periodo INT,
    valor DECIMAL(4,2) NOT NULL,
    observacion_conducta TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_matricula) REFERENCES matricula(id_matricula) ON DELETE SET NULL,
    FOREIGN KEY (id_periodo) REFERENCES periodo(id_periodo) ON DELETE SET NULL
);
