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

    class Config:
        orm_mode = True


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


def _check_local_availability(
    session: SessionDep,
    local_id: Optional[int],
    start_date: datetime,
    end_date: datetime,
    ignore_event_id: Optional[int] = None,
) -> None:
    """
    Verifica se o local está disponível entre start_date e end_date.
    Lança HTTPException 400 se houver conflito ou se o intervalo for inválido.
    """

    if end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A data de término deve ser igual ou posterior à data de início.",
        )

    if local_id is None:
        return

    stmt = select(Event).where(Event.local_id == local_id)

    if ignore_event_id is not None:
        stmt = stmt.where(Event.id != ignore_event_id)

    stmt = stmt.where(
        Event.start_date < end_date,
        Event.end_date > start_date,
    )

    conflict = session.exec(stmt).first()
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Local indisponível neste horário. Já existe um evento agendado.",
        )


@router.get("", response_model=List[Event])
def listar_events(session: SessionDep):
    return session.exec(select(Event)).all()


@router.get("/{id}", response_model=EventRead)
def obter_evento(
    id: int,
    session: SessionDep,
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
        creator_name=event.creator.full_name if event.creator else None,
        created_at=event.created_at,
    )


@router.post("", status_code=status.HTTP_201_CREATED, response_model=Event)
def cadastrar_event(
    event: EventCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    _check_local_availability(
        session=session,
        local_id=event.local_id,
        start_date=event.start_date,
        end_date=event.end_date,
    )

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
    event = session.exec(select(Event).where(Event.id == id)).first()

    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")

    new_local_id = (
        event_data.local_id
        if event_data.local_id is not None
        else event.local_id
    )
    new_start_date = (
        event_data.start_date if event_data.start_date is not None else event.start_date
    )
    new_end_date = (
        event_data.end_date if event_data.end_date is not None else event.end_date
    )

    _check_local_availability(
        session=session,
        local_id=new_local_id,
        start_date=new_start_date,
        end_date=new_end_date,
        ignore_event_id=event.id,
    )

    update_data = event_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)

    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def deletar_event(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    event = session.exec(select(Event).where(Event.id == id)).first()

    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")

    session.delete(event)
    session.commit()
    return {"message": "Evento excluído com sucesso."}
