# routers/event_comments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from database import SessionDep
from models import EventComment, User
from routers.auth import get_current_user

router = APIRouter(prefix="/event_comments", tags=["Comentários de Eventos"])

@router.get("")
def listar_comments(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[EventComment]:
    return session.exec(select(EventComment)).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_comment(comment: EventComment, session: SessionDep, current_user: User = Depends(get_current_user)) -> EventComment:
    comment.author_id = current_user.id  # garante que o autor é o usuário logado
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment
