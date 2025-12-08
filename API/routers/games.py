from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from database import SessionDep
from models import Game, User
from routers.auth import get_current_user


class GameCreate(BaseModel):
    event_id: int   # 🔥 essencial!
    team1: str
    team2: str
    game_date: date
    game_time: time
    location: Optional[str] = None
    notes: Optional[str] = None


class GameRead(BaseModel):
    id: int
    event_id: int
    team1: str
    team2: str
    game_date: date
    game_time: time
    location: Optional[str]
    notes: Optional[str]
    created_at: datetime
    creator_id: int
    creator_name: str
    




router = APIRouter(prefix="/games", tags=["Jogos"])

@router.get("", response_model=list[Game])
def listar_games(
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    return session.exec(select(Game)).all()


@router.get("/{id}", response_model=GameRead)
def obter_game(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    game = session.get(Game, id)
    if not game:
        raise HTTPException(404, "Jogo não encontrado")

    return GameRead(
        id=game.id,
        event_id=game.event_id,
        team1=game.team1,
        team2=game.team2,
        game_date=game.game_date,
        game_time=game.game_time,
        location=game.location,
        notes=game.notes,
        created_at=game.created_at,
        creator_id=game.creator_id,
        creator_name=game.creator.full_name,
    )



@router.post("", response_model=Game)
def criar_game(
    game: GameCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    novo = Game(
        **game.dict(),
        creator_id=current_user.id
    )
    session.add(novo)
    session.commit()
    session.refresh(novo)
    return novo



@router.put("/{id}", response_model=Game)
def atualizar_game(
    id: int,
    game_data: GameCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    game = session.get(Game, id)
    if not game:
        raise HTTPException(404)

    for key, value in game_data.dict(exclude_unset=True).items():
        setattr(game, key, value)

    session.add(game)
    session.commit()
    session.refresh(game)
    return game


@router.delete("/{id}")
def deletar_game(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    game = session.get(Game, id)
    if not game:
        raise HTTPException(404)

    session.delete(game)
    session.commit()
    return {"message": "Jogo excluído com sucesso"}

@router.get("/event/{event_id}", response_model=list[Game])
def listar_games_do_evento(
    event_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    jogos = session.exec(
        select(Game).where(Game.event_id == event_id)
    ).all()

    return jogos
