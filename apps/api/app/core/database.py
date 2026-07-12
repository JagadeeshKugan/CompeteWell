import logging
from urllib.parse import urlparse
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)

# Base class for SQLAlchemy models using SQLAlchemy 2.0 modern typing
class Base(DeclarativeBase):
    pass


def check_and_create_db(db_url: str) -> None:
    """
    Checks if the target database exists, and if not, connects to the
    default 'postgres' database to create it automatically.
    """
    parsed = urlparse(db_url)
    dbname = parsed.path.lstrip("/")
    
    # Reconstruct the connection URL to connect to the 'postgres' maintenance DB
    # We strip the path and use '/postgres'
    postgres_url = parsed._replace(path="/postgres").geturl()
    
    try:
        # Attempt direct connection to the target database
        conn = psycopg2.connect(db_url)
        conn.close()
        logger.info(f"Successfully connected to database '{dbname}'")
    except psycopg2.OperationalError as e:
        if "does not exist" in str(e):
            logger.warning(f"Database '{dbname}' does not exist. Attempting auto-creation...")
            try:
                # Connect to 'postgres' database to execute CREATE DATABASE
                conn = psycopg2.connect(postgres_url)
                conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                cursor = conn.cursor()
                # Run database creation query
                cursor.execute(f'CREATE DATABASE "{dbname}";')
                cursor.close()
                conn.close()
                logger.info(f"Database '{dbname}' created successfully!")
            except Exception as create_err:
                logger.error(f"Failed to automatically create database '{dbname}': {create_err}")
                raise create_err
        else:
            logger.error(f"PostgreSQL connection error: {e}")
            raise e

# Initialise database provisioning
try:
    check_and_create_db(settings.DATABASE_URL)
except Exception as e:
    logger.error(f"Database provisioning failed: {e}")

from typing import Generator
from sqlalchemy.orm import Session

# Configure SQLAlchemy engine and session
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency yielding a database session and closing it on cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

