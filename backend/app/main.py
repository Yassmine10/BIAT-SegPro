from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import settings
from app.controllers import auth, user
from app.database.session import engine, Base, SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash

# Startup db and seed setup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # Seed initial data
    db = SessionLocal()
    try:
        # Check if Admin exists
        admin = db.query(User).filter(User.email == "admin@biat.com.tn").first()
        if not admin:
            db_admin = User(
                first_name="BIAT",
                last_name="Administrator",
                email="admin@biat.com.tn",
                password=get_password_hash("admin1234"),
                role="Administrator"
            )
            db.add(db_admin)
            
        # Check if Analyst exists
        analyst = db.query(User).filter(User.email == "analyst@biat.com.tn").first()
        if not analyst:
            db_analyst = User(
                first_name="Retail",
                last_name="Analyst",
                email="analyst@biat.com.tn",
                password=get_password_hash("analyst1234"),
                role="Retail Banking Analyst"
            )
            db.add(db_analyst)
            
        db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
        
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Customer Segmentation Platform for Retail Banking at BIAT",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS configuration
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(user.router, prefix=settings.API_V1_STR)

# Health endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """Simple API status check."""
    return {"status": "healthy", "service": settings.PROJECT_NAME}
