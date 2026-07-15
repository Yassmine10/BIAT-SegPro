from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user import user_repository
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserService:
    def get_user_by_id(self, db: Session, user_id: int) -> Optional[User]:
        user = user_repository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        return user

    def get_users(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return user_repository.get_multi(db, skip=skip, limit=limit)

    def create_user(self, db: Session, obj_in: UserCreate) -> User:
        existing_user = user_repository.get_by_email(db, obj_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists"
            )
        return user_repository.create(db, obj_in)

    def update_user(self, db: Session, user_id: int, obj_in: UserUpdate) -> User:
        user = self.get_user_by_id(db, user_id)
        # Check email uniqueness if email is being updated
        if obj_in.email and obj_in.email != user.email:
            existing_user = user_repository.get_by_email(db, obj_in.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A user with this email address already exists"
                )
        return user_repository.update(db, user, obj_in)

    def delete_user(self, db: Session, user_id: int) -> User:
        user = self.get_user_by_id(db, user_id)
        return user_repository.delete(db, user_id)

user_service = UserService()
