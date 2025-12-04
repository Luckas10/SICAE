from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import select
from pydantic import BaseModel
from typing import List
from passlib.context import CryptContext
from database import SessionDep
from models import User, Role

from routers.auth import get_current_user

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    Role: str = "Aluno"


class UserAvatarUpdate(BaseModel):
    profile_image: str


router = APIRouter(prefix="/users", tags=["Usuários"])


@router.get("")
def listar_users(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
) -> List[User]:
    return session.exec(select(User)).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_user(session: SessionDep, data: UserCreate) -> User:
    exists = session.exec(
        select(User).where(User.full_name == data.full_name)
    ).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já existe.",
        )

    exists_email = session.exec(
        select(User).where(User.email == data.email)
    ).first()
    if exists_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado.",
        )

    hashed = bcrypt_context.hash(data.password)

    try:
        role_enum = Role(data.Role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role inválido.",
        )

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hashed,
        role=role_enum,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@router.put("/{id}")
def atualizar_user(
    session: SessionDep,
    id: int,
    full_name: str,
    role: str,
    current_user: User = Depends(get_current_user),
) -> User:
    user = session.exec(select(User).where(User.id == id)).one()
    user.full_name = full_name
    user.role = role
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.delete("/{id}")
def deletar_user(
    session: SessionDep,
    id: int,
    current_user: User = Depends(get_current_user),
) -> str:
    user = session.exec(select(User).where(User.id == id)).one()
    session.delete(user)
    session.commit()
    return "Usuário excluído com sucesso."


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "profile_image": current_user.profile_image,
    }


@router.put("/me/avatar")
def update_my_avatar(
    data: UserAvatarUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    user = session.get(User, current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    user.profile_image = data.profile_image
    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image": user.profile_image,
    }
