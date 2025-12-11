from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from database import SessionDep
from models import Game, User
from routers.auth import get_current_user



class GameCreate(BaseModel):
    event_id: int
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
    creator_name: Optional[str]

    class Config:
        orm_mode = True


router = APIRouter(prefix="/games", tags=["Jogos"])



@router.get("", response_model=List[Game])
def listar_games(session: SessionDep):
    return session.exec(select(Game)).all()


@router.get("/event/{event_id}", response_model=List[GameRead])
def listar_games_do_evento(
    event_id: int,
    session: SessionDep,
):
    games = session.exec(
        select(Game).where(Game.event_id == event_id)
    ).all()

    return [
        GameRead(
            id=g.id,
            event_id=g.event_id,
            team1=g.team1,
            team2=g.team2,
            game_date=g.game_date,
            game_time=g.game_time,
            location=g.location,
            notes=g.notes,
            created_at=g.created_at,
            creator_id=g.creator_id,
            creator_name=g.creator.full_name if g.creator else None,
        )
        for g in games
    ]


@router.get("/{id}", response_model=GameRead)
def obter_game(
    id: int,
    session: SessionDep,
):
    g = session.get(Game, id)
    if not g:
        raise HTTPException(404, "Jogo não encontrado")

    return GameRead(
        id=g.id,
        event_id=g.event_id,
        team1=g.team1,
        team2=g.team2,
        game_date=g.game_date,
        game_time=g.game_time,
        location=g.location,
        notes=g.notes,
        created_at=g.created_at,
        creator_id=g.creator_id,
        creator_name=g.creator.full_name if g.creator else None,
    )



@router.post("", response_model=Game, status_code=status.HTTP_201_CREATED)
def criar_game(
    game: GameCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    novo = Game(
        **game.dict(),
        creator_id=current_user.id,
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
    current_user: User = Depends(get_current_user),
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


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def deletar_game(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    game = session.get(Game, id)
    if not game:
        raise HTTPException(404)

    session.delete(game)
    session.commit()
    return {"message": "Jogo excluído com sucesso"}
