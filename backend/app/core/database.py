import os
from urllib.parse import quote_plus

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Permite sobreescribir toda la URL desde entorno.
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
else:
    # Para desarrollo local, usamos SQLite por defecto y evitamos bloqueos por root en MySQL.
    db_driver = os.getenv("DB_DRIVER", "sqlite").lower()
    if db_driver == "mysql":
        db_user = os.getenv("DB_USER", "cefup")
        db_password = quote_plus(os.getenv("DB_PASSWORD", "cefup123"))
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "3306")
        db_name = os.getenv("DB_NAME", "cefup_db")
        SQLALCHEMY_DATABASE_URL = (
            f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        )
    else:
        SQLALCHEMY_DATABASE_URL = os.getenv("SQLITE_URL", "sqlite:///./cefup_dev.db")

engine_kwargs = {
    "pool_pre_ping": True,
    "pool_recycle": 3600,
}

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()