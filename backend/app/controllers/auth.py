from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import LoginRequest, Token, UserResponse
from app.services.auth import auth_service, get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    return auth_service.login(db, login_data)

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response, current_user: User = Depends(get_current_user)):
    """Log out the current user.
    Since we are using JWT, the actual token invalidation is handled by the client 
    discarding the token. On the server side, we acknowledge the logout request.
    """
    return {"detail": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile information."""
    return current_user
