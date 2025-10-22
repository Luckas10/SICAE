from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import lifespan
from routers import users, auth, event_comment, events, places

tags_metadata = [
    {"name": "Usuários", "description": "Gerenciamento de contas de atletas, alunos e professores."},
    {"name": "Locais", "description": "Gerenciamento de locais e suas reservas."},
    {"name": "Eventos", "description": "Gerenciamento de eventos esportivos e culturais."},
    {"name": "Iniciativas", "description": "Gerenciamento de iniciativas de projetos e atividades."}
]

app = FastAPI(
    lifespan=lifespan,
    title="SICAE API",
    description="API de gerenciamento do sistema de esportes.",
    version="1.0.0",
    openapi_tags=tags_metadata
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra os routers
app.include_router(auth.router, tags=["Login"])
app.include_router(users.router, tags=["Usuários"])
app.include_router(events.router, tags=["Eventos"])
app.include_router(event_comment.router, tags=["Eventos"])
app.include_router(places.router, tags=["Locais"])