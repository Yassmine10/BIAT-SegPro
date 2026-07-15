from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "BIAT SegPro"
    API_V1_STR: str = "/api"
    
    # JWT Settings
    JWT_SECRET_KEY: str = "biat_segpro_super_secret_jwt_signing_key_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database Settings
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/biat_segpro"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    model_config = ConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
