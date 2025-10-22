# routers/auth.py
from fastapi import APIRouter, HTTPException, status, Depends, Form
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select
from typing import Annotated, Optional
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel

from database import SessionDep
from models import User

router = APIRouter(prefix="/auth", tags=["Login"])

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")  # tokenUrl consistente

# ==============================
# Configurações JWT
# ==============================
SECRET_KEY = "minha_chave_secreta_super_segura"  # troque para produção
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(email: str, user_id: int, expires_delta: Optional[timedelta] = None):
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {
        "sub": email,
        "id": user_id,
        "exp": expire  # datetime direto funciona com jose.jwt
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

# ==============================
# Schemas
# ==============================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ==============================
# Endpoints
# ==============================
@router.post("/token", response_model=TokenResponse)
def login(
    session: SessionDep,
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    grant_type: Annotated[str, Form()] = "password"
):
    # busca usuário pelo email
    user = session.exec(select(User).where(User.email == username)).first()
    if not user or not bcrypt_context.verify(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais incorretas."
        )

    token = create_access_token(user.email, user.id)
    return {"access_token": token, "token_type": "bearer"}


# ==============================
# Dependência para rotas protegidas
# ==============================
def get_current_user(
    token: Annotated[str, Depends(oauth2_bearer)],
    session: SessionDep
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("id")

        if not email or not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado."
            )

        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado."
            )

        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado."
        )
