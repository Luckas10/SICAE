from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List

from models import NewsComment
from database import SessionDep
from routers.auth import get_current_user
from models import User

router = APIRouter(prefix="/news-comments", tags=["News Comments"])

from pydantic import BaseModel

class NewsCommentCreate(BaseModel):
    article_id: int
    content: str


@router.post("/", response_model=NewsComment)
def create_comment(
    data: NewsCommentCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    comment = NewsComment(
        article_id=data.article_id,
        content=data.content,
        author_id=current_user.id,
    )

    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@router.get("/article/{article_id}", response_model=List[NewsComment])
def list_comments_by_article(
    article_id: int,
    session: SessionDep,
):
    statement = select(NewsComment).where(NewsComment.article_id == article_id)
    return session.exec(statement).all()

@router.put("/{comment_id}", response_model=NewsComment)
def update_comment(
    comment_id: int,
    new_content: str,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    comment = session.get(NewsComment, comment_id)

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
    comment = session.get(NewsComment, comment_id)

    if not comment:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")

    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão para excluir")

    session.delete(comment)
    session.commit()
