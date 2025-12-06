from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from pydantic import BaseModel

from models import EventComment, User
from database import SessionDep
from routers.auth import get_current_user

router = APIRouter(prefix="/events-comments", tags=["Events Comments"])


class EventCommentCreate(BaseModel):
    event_id: int
    content: str


@router.post("/", response_model=EventComment, status_code=status.HTTP_201_CREATED)
def create_comment(
    data: EventCommentCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    comment = EventComment(
        event_id=data.event_id,
        content=data.content,
        author_id=current_user.id,
    )

    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@router.get("/event/{event_id}", response_model=List[EventComment])
def list_comments_by_event(
    event_id: int,
    session: SessionDep,
):
    statement = select(EventComment).where(EventComment.event_id == event_id)
    return session.exec(statement).all()


@router.put("/{comment_id}", response_model=EventComment)
def update_comment(
    comment_id: int,
    new_content: str,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    comment = session.get(EventComment, comment_id)

    if not comment:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")

    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão para editar")

    comment.content = new_content
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    comment = session.get(EventComment, comment_id)

    if not comment:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")

    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão para excluir")

    session.delete(comment)
    session.commit()
