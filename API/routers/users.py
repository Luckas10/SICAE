from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import select, func
from pydantic import BaseModel
from typing import List
from passlib.context import CryptContext

from database import SessionDep
from models import User, Role, EventComment, NewsComment
from routers.auth import get_current_user

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/users", tags=["Usuários"])



class PublicUser(BaseModel):
    id: int  
    full_name: str
    role: Role
    profile_image: str | None = None


class PublicUserProfile(BaseModel):
    id: int
    full_name: str
    email: str
    role: Role
    profile_image: str | None = None
    total_comments: int
    event_comments: int
    news_comments: int


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    Role: str = "Aluno"


class UserAvatarUpdate(BaseModel):
    profile_image: str



@router.get("/public", response_model=List[PublicUser])
def listar_users_publico(session: SessionDep):
    users = session.exec(select(User)).all()

    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "role": u.role,
            "profile_image": u.profile_image,
        }
        for u in users
    ]


@router.get("/public/{id}", response_model=PublicUserProfile)
def perfil_publico_user(session: SessionDep, id: int):

    user = session.get(User, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    event_comments = session.exec(
        select(func.count(EventComment.id))
        .where(EventComment.author_id == user.id)
    ).one()

    news_comments = session.exec(
        select(func.count(NewsComment.id))
        .where(NewsComment.author_id == user.id)
    ).one()

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "profile_image": user.profile_image,
        "total_comments": event_comments + news_comments,
        "event_comments": event_comments,
        "news_comments": news_comments,
    }



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

    user = session.get(User, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

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

    user = session.get(User, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    session.delete(user)
    session.commit()
    return "Usuário excluído com sucesso."


@router.get("/me")
def get_me(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    event_comments = session.exec(
        select(func.count(EventComment.id))
        .where(EventComment.author_id == current_user.id)
    ).one()

    news_comments = session.exec(
        select(func.count(NewsComment.id))
        .where(NewsComment.author_id == current_user.id)
    ).one()

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "profile_image": current_user.profile_image,
        "total_comments": event_comments + news_comments,
        "event_comments": event_comments,
        "news_comments": news_comments,
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
