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

router = APIRouter(prefix="/locals", tags=["Locais"])

@router.get("")
def listar_locals(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[Local]:
    return session.exec(select(Local)).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_local(local: LocalCreate, session: SessionDep, current_user: User = Depends(get_current_user)) -> Local:
    
    new_local = Local(
        name = local.name,
        description = local.description,
        capacity = local.capacity
    )
    
    session.add(new_local)
    session.commit()
    session.refresh(new_local)
    return new_local

@router.put("/{id}")
def atualizar_local(id: int, local_data: Local, session: SessionDep, current_user: User = Depends(get_current_user)) -> Local:
    local = session.exec(select(Local).where(Local.id == id)).one()
    for key, value in local_data.dict(exclude_unset=True).items():
        setattr(local, key, value)
    session.add(local)
    session.commit()
    session.refresh(local)
    return local

@router.delete("/{id}")
def deletar_local(id: int, session: SessionDep, current_user: User = Depends(get_current_user)) -> str:
    local = session.exec(select(Local).where(Local.id == id)).one()
    session.delete(local)
    session.commit()
    return "Local excluído com sucesso."
