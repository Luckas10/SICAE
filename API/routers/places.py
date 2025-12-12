from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from pydantic import BaseModel
from typing import List

from database import SessionDep
from models import Place, User
from routers.auth import get_current_user


class PlaceCreate(BaseModel):
    name: str
    description: str
    capacity: int
    image_path: str | None = None


class PlaceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    capacity: int | None = None
    image_path: str | None = None


router = APIRouter(prefix="/places", tags=["Locais"])


@router.get("", response_model=List[Place])
def listar_places(session: SessionDep):
    return session.exec(select(Place)).all()


@router.get("/{id}", response_model=Place)
def obter_place(id: int, session: SessionDep):
    place = session.exec(select(Place).where(Place.id == id)).first()

    if not place:
        raise HTTPException(status_code=404, detail="Local não encontrado.")

    return place


@router.post("", status_code=status.HTTP_201_CREATED, response_model=Place)
def cadastrar_place(
    place: PlaceCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    new_place = Place(
        name=place.name,
        description=place.description,
        capacity=place.capacity,
        image_path=place.image_path,
    )

    session.add(new_place)
    session.commit()
    session.refresh(new_place)
    return new_place


@router.put("/{id}", response_model=Place)
def atualizar_place(
    id: int,
    place_data: PlaceUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    place = session.exec(select(Place).where(Place.id == id)).first()

    if not place:
        raise HTTPException(status_code=404, detail="Local não encontrado.")

    for key, value in place_data.dict(exclude_unset=True).items():
        setattr(place, key, value)

    session.add(place)
    session.commit()
    session.refresh(place)
    return place


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def deletar_place(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    place = session.exec(select(Place).where(Place.id == id)).first()

    if not place:
        raise HTTPException(status_code=404, detail="Local não encontrado.")

    session.delete(place)
    session.commit()
    return {"message": "Local excluído com sucesso."}
