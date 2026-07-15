from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user import user_service
from app.services.auth import RoleChecker, get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

# Require Administrator role to create users
admin_only = RoleChecker(["Administrator"])

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    _current_admin: User = Depends(admin_only)
):
    """Create a new user. Only accessible by Administrators."""
    return user_service.create_user(db, user_in)

@router.get("", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
):
    """Retrieve all users. Accessible by any logged-in user."""
    return user_service.get_users(db, skip=skip, limit=limit)
