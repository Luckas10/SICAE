# routers/event_comments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from pydantic import BaseModel
from typing import List
from database import SessionDep
from models import EventComment, User
from routers.auth import get_current_user

class CommentCreate(BaseModel):
    event_id: int
    content: str

router = APIRouter(prefix="/event_comments", tags=["Comentários de Eventos"])

@router.get("")
def listar_comments(session: SessionDep, current_user: User = Depends(get_current_user)) -> List[EventComment]:
    return session.exec(select(EventComment)).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def cadastrar_comment(comment: CommentCreate, session: SessionDep, current_user: User = Depends(get_current_user)) -> EventComment:
    new_comment = EventComment(
        event_id = comment.event_id,
        author_id = current_user.id,
        content = comment.content
    )
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)
    return new_comment
