import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Loaind dotenv file
load_dotenv()

# IMPORT DATABASE_URL FROM THE .ENV
DATABASE_URL = os.getenv("DATABASE_URL")

# CHECKING DATABASE_URL IS NONE
if DATABASE_URL is None:
    raise RuntimeError(f"{DATABASE_URL} is not configured")

# CREATE ENGINE
engine = create_engine(
    DATABASE_URL,
    echo=True
)

# CREATE LOCAL SESSION MAKER
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False
)

# CREATE SQLALCHEMY BASE class


class Base(DeclarativeBase):
    pass
