from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from database import SessionDep
from models import Event, User
from routers.auth import get_current_user


class EventCreate(BaseModel):
    local_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    category: Optional[str] = None
    cover_image: Optional[str] = None
    is_initiation: bool = False


class EventRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    category: Optional[str] = None
    cover_image: Optional[str] = None
    is_initiation: bool = False
    creator_id: int
    creator_name: str
    created_at: datetime

class EventUpdate(BaseModel):
    local_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    category: Optional[str] = None
    cover_image: Optional[str] = None
    is_initiation: Optional[bool] = None

    class Config:
        orm_mode = True


router = APIRouter(prefix="/events", tags=["Eventos"])


@router.get("", response_model=List[Event])
def listar_events(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    return session.exec(select(Event)).all()


@router.get("/{id}", response_model=EventRead)
def obter_evento(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    event = session.get(Event, id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")

    return EventRead(
        id=event.id,
        title=event.title,
        description=event.description,
        start_date=event.start_date,
        end_date=event.end_date,
        category=event.category,
        cover_image=event.cover_image,
        is_initiation=event.is_initiation,
        creator_id=event.creator_id,
        creator_name=event.creator.full_name,
        created_at=event.created_at,
    )


@router.post("", status_code=status.HTTP_201_CREATED, response_model=Event)
def cadastrar_event(
    event: EventCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    new_event = Event(
        creator_id=current_user.id,
        local_id=event.local_id,
        title=event.title,
        description=event.description,
        start_date=event.start_date,
        end_date=event.end_date,
        category=event.category,
        cover_image=event.cover_image,
        is_initiation=event.is_initiation,
    )

    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event


@router.put("/{id}", response_model=Event)
def atualizar_event(
    id: int,
    event_data: EventUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    event = session.exec(select(Event).where(Event.id == id)).one()

    update_data = event_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(event, key, value)

    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.delete("/{id}")
def deletar_event(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    event = session.exec(select(Event).where(Event.id == id)).one()
    session.delete(event)
    session.commit()
    return "Evento excluído com sucesso."
