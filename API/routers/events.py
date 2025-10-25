from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from database import SessionDep
from models import Event, User
from routers.auth import get_current_user

class EventCreate(BaseModel):
    local_id: int
    title: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime

class EventUpdate(BaseModel):
    local_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

router = APIRouter(prefix="/events", tags=["Eventos"])

@router.get("")
def listar_events(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[Event]:
    return session.exec(select(Event)).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_event(event: EventCreate, session: SessionDep, current_user: User = Depends(get_current_user)) -> Event:
    new_event = Event(
        creator_id=current_user.id,
        local_id=event.local_id,
        title=event.title,
        description=event.description,
        start_date=event.start_date,
        end_date=event.end_date
    )
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event

@router.put("/{id}")
def atualizar_event(id: int, event_data: EventUpdate, session: SessionDep, current_user: User = Depends(get_current_user)) -> Event:
    event = session.exec(select(Event).where(Event.id == id)).one()
    for key, value in event_data.model_dump(exclude_unset=True).items():
        setattr(event, key, value)
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@router.delete("/{id}")
def deletar_event(id: int, session: SessionDep, current_user: User = Depends(get_current_user)) -> str:
    event = session.exec(select(Event).where(Event.id == id)).one()
    session.delete(event)
    session.commit()
    return "Evento excluído com sucesso."
