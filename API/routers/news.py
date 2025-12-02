from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from database import SessionDep
from models import NewsArticle, User
from routers.auth import get_current_user

class NewsArticleCreate(BaseModel):
    title: str
    content: Optional[str] = None
    add_info: Optional[str] = None
    category: Optional[str] = None
    cover_image: Optional[str] = None
    priority: str = None

class NewsArticleRead(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    add_info: Optional[str] = None
    category: Optional[str] = None
    cover_image: Optional[str] = None
    creator_id: int
    creator_name: str
    created_at: datetime

    class Config:
        orm_mode = True

router = APIRouter(prefix="/news", tags=["Notícias"])

@router.get("", response_model=List[NewsArticle])
def listar_noticias(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    return session.exec(select(NewsArticle)).all()

@router.get("/{id}", response_model=NewsArticleRead)
def obter_noticia(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    article = session.get(NewsArticle, id)
    if not article:
        raise HTTPException(status_code=404, detail="Notícia não encontrada.")

    return NewsArticleRead(
        id=article.id,
        title=article.title,
        content=article.content,
        add_info=article.add_info,
        category=article.category,
        cover_image=article.cover_image,
        priority=article.priority,
        creator_id=article.creator_id,
        creator_name=article.creator.full_name,
        created_at=article.created_at,
    )

@router.post("", status_code=status.HTTP_201_CREATED, response_model=NewsArticle)
def criar_noticia(
    data: NewsArticleCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    noticia = NewsArticle(
        creator_id=current_user.id,
        title=data.title,
        content=data.content,
        add_info=data.add_info,
        category=data.category,
        cover_image=data.cover_image,
        priority=data.priority
    )

    session.add(noticia)
    session.commit()
    session.refresh(noticia)
    return noticia

@router.put("/{id}", response_model=NewsArticle)
def atualizar_noticia(
    id: int,
    data: NewsArticleCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    article = session.exec(select(NewsArticle).where(NewsArticle.id == id)).first()

    if not article:
        raise HTTPException(status_code=404, detail="Notícia não encontrada.")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(article, key, value)

    session.add(article)
    session.commit()
    session.refresh(article)
    return article

@router.delete("/{id}")
def deletar_noticia(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    article = session.exec(select(NewsArticle).where(NewsArticle.id == id)).first()

    if not article:
        raise HTTPException(status_code=404, detail="Notícia não encontrada.")

    session.delete(article)
    session.commit()
    return {"detail": "Notícia excluída com sucesso."}
