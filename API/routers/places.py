from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from pydantic import BaseModel
from typing import List

from database import SessionDep
from models import Local, User
from routers.auth import get_current_user


class LocalCreate(BaseModel):
    name: str
    description: str
    capacity: int
    image_path: str | None = None


class LocalUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    capacity: int | None = None
    image_path: str | None = None


router = APIRouter(prefix="/locals", tags=["Locais"])


@router.get("", response_model=List[Local])
def listar_locals(session: SessionDep):
    return session.exec(select(Local)).all()


@router.get("/{id}", response_model=Local)
def obter_local(id: int, session: SessionDep):
    local = session.exec(select(Local).where(Local.id == id)).first()

    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado.")

    return local


@router.post("", status_code=status.HTTP_201_CREATED, response_model=Local)
def cadastrar_local(
    local: LocalCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    new_local = Local(
        name=local.name,
        description=local.description,
        capacity=local.capacity,
        image_path=local.image_path,
    )

    session.add(new_local)
    session.commit()
    session.refresh(new_local)
    return new_local


@router.put("/{id}", response_model=Local)
def atualizar_local(
    id: int,
    local_data: LocalUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    local = session.exec(select(Local).where(Local.id == id)).first()

    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado.")

    for key, value in local_data.dict(exclude_unset=True).items():
        setattr(local, key, value)

    session.add(local)
    session.commit()
    session.refresh(local)
    return local


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def deletar_local(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    local = session.exec(select(Local).where(Local.id == id)).first()

    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado.")

    session.delete(local)
    session.commit()
    return {"message": "Local excluído com sucesso."}
