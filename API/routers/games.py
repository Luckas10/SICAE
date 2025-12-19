from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from database import SessionDep
from models import Game, User, Event
from routers.auth import get_current_user


class GameCreate(BaseModel):
    event_id: int
    team1: str
    team2: str
    game_date: date
    game_time: time
    game_end_time: time
    notes: Optional[str] = None


class GameRead(BaseModel):
    id: int
    event_id: int
    team1: str
    team2: str
    game_date: date
    game_time: time
    game_end_time: time
    notes: Optional[str]
    status: str
    created_at: datetime
    creator_id: int
    creator_name: Optional[str]

    class Config:
        orm_mode = True


router = APIRouter(prefix="/games", tags=["Jogos"])


def _check_game_within_event_window(
    *,
    event: Event,
    game_date: date,
    game_time: time,
    game_end_time: time,
) -> None:
    start_dt = datetime.combine(game_date, game_time)
    end_dt = datetime.combine(game_date, game_end_time)

    if end_dt < start_dt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O horário final do jogo deve ser igual ou posterior ao horário inicial.",
        )

    if start_dt < event.start_date or end_dt > event.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O jogo deve ocorrer totalmente dentro do horário do evento.",
        )


@router.get("", response_model=List[Game])
def listar_games(session: SessionDep):
    return session.exec(select(Game)).all()


@router.get("/event/{event_id}", response_model=List[GameRead])
def listar_games_do_evento(event_id: int, session: SessionDep):
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
            game_end_time=g.game_end_time,
            notes=g.notes,
            status=g.status,
            created_at=g.created_at,
            creator_id=g.creator_id,
            creator_name=g.creator.full_name if g.creator else None,
        )
        for g in games
    ]


@router.get("/{id}", response_model=GameRead)
def obter_game(id: int, session: SessionDep):
    g = session.get(Game, id)
    if not g:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")

    return GameRead(
        id=g.id,
        event_id=g.event_id,
        team1=g.team1,
        team2=g.team2,
        game_date=g.game_date,
        game_time=g.game_time,
        game_end_time=g.game_end_time,
        notes=g.notes,
        status=g.status,
        created_at=g.created_at,
        creator_id=g.creator_id,
        creator_name=g.creator.full_name if g.creator else None,
    )


@router.post("", response_model=GameRead, status_code=status.HTTP_201_CREATED)
def criar_game(
    game: GameCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    event = session.get(Event, game.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")

    _check_game_within_event_window(
        event=event,
        game_date=game.game_date,
        game_time=game.game_time,
        game_end_time=game.game_end_time,
    )

    novo = Game(
        **game.dict(),
        status="scheduled",
        creator_id=current_user.id,
    )

    session.add(novo)
    session.commit()
    session.refresh(novo)

    return obter_game(novo.id, session)


@router.put("/{id}", response_model=GameRead)
def atualizar_game(
    id: int,
    game_data: GameCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    game = session.get(Game, id)
    if not game:
        raise HTTPException(status_code=404, detail="Jogo não encontrado.")

    event = session.get(Event, game.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")

    _check_game_within_event_window(
        event=event,
        game_date=game_data.game_date,
        game_time=game_data.game_time,
        game_end_time=game_data.game_end_time,
    )

    game.team1 = game_data.team1
    game.team2 = game_data.team2
    game.game_date = game_data.game_date
    game.game_time = game_data.game_time
    game.game_end_time = game_data.game_end_time
    game.notes = game_data.notes
    game.status = "scheduled"

    session.add(game)
    session.commit()
    session.refresh(game)

    return obter_game(game.id, session)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def deletar_game(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    game = session.get(Game, id)
    if not game:
        raise HTTPException(status_code=404, detail="Jogo não encontrado.")

    session.delete(game)
    session.commit()
    return {"message": "Jogo excluído com sucesso"}
