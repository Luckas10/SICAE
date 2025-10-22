# models.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List


# ============================================================
# ENUMS
# ============================================================

class Role(str, Enum):
    aluno = "Aluno"
    servidor = "Servidor"
    gestor = "Gestor"
    admin = "Admin"


# ============================================================
# USUÁRIOS
# ============================================================

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    role: Role = Field(default=Role.aluno, nullable=False)
    full_name: str = Field(max_length=150, nullable=False)
    email: str = Field(unique=True, nullable=False, index=True)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    # relacionamentos
    events: List["Event"] = Relationship(back_populates="creator")
    initiatives: List["Initiative"] = Relationship(back_populates="creator")
    comments: List["EventComment"] = Relationship(back_populates="author")
    notifications: List["Notification"] = Relationship(back_populates="user")
    forum_threads: List["ForumThread"] = Relationship(back_populates="author")
    forum_posts: List["ForumPost"] = Relationship(back_populates="author")
    articles: List["Article"] = Relationship(back_populates="author")
    audit_logs: List["AuditLog"] = Relationship(back_populates="user")


# ============================================================
# LOCAIS
# ============================================================

class Local(SQLModel, table=True):
    __tablename__ = "locals"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=120, nullable=False)
    description: Optional[str] = Field(default=None)
    capacity: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    events: List["Event"] = Relationship(back_populates="local")
    reservations: List["LocalReservation"] = Relationship(back_populates="local")


# ============================================================
# EVENTOS
# ============================================================

class Event(SQLModel, table=True):
    __tablename__ = "events"

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="users.id", nullable=False)
    local_id: Optional[int] = Field(default=None, foreign_key="locals.id")
    title: str = Field(max_length=120, nullable=False)
    description: Optional[str] = Field(default=None)
    start_date: datetime = Field(nullable=False)
    end_date: datetime = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    creator: Optional[User] = Relationship(back_populates="events")
    local: Optional[Local] = Relationship(back_populates="events")
    comments: List["EventComment"] = Relationship(back_populates="event")
    ratings: List["EventRating"] = Relationship(back_populates="event")
    registrations: List["EventRegistration"] = Relationship(back_populates="event")


# ============================================================
# INICIATIVAS
# ============================================================

class Initiative(SQLModel, table=True):
    __tablename__ = "initiatives"

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="users.id", nullable=False)
    title: str = Field(max_length=120, nullable=False)
    description: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    creator: Optional[User] = Relationship(back_populates="initiatives")
    comments: List["InitiativeComment"] = Relationship(back_populates="initiative")
    enrollments: List["InitiativeEnrollment"] = Relationship(back_populates="initiative")
    ratings: List["InitiativeRating"] = Relationship(back_populates="initiative")
    schedules: List["InitiativeSchedule"] = Relationship(back_populates="initiative")


# ============================================================
# RESERVAS DE LOCAIS
# ============================================================

class LocalReservation(SQLModel, table=True):
    __tablename__ = "local_reservations"

    id: Optional[int] = Field(default=None, primary_key=True)
    local_id: int = Field(foreign_key="locals.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    purpose: str = Field(max_length=120)
    start_time: datetime = Field(nullable=False)
    end_time: datetime = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    local: Optional[Local] = Relationship(back_populates="reservations")
    user: Optional[User] = Relationship()


# ============================================================
# COMENTÁRIOS E AVALIAÇÕES
# ============================================================

class EventComment(SQLModel, table=True):
    __tablename__ = "event_comments"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id", nullable=False)
    author_id: int = Field(foreign_key="users.id", nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    event: Optional[Event] = Relationship(back_populates="comments")
    author: Optional[User] = Relationship(back_populates="comments")


class EventRating(SQLModel, table=True):
    __tablename__ = "event_ratings"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    score: int = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    event: Optional[Event] = Relationship(back_populates="ratings")


class EventRegistration(SQLModel, table=True):
    __tablename__ = "event_registrations"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    event: Optional[Event] = Relationship(back_populates="registrations")


class InitiativeComment(SQLModel, table=True):
    __tablename__ = "initiative_comments"

    id: Optional[int] = Field(default=None, primary_key=True)
    initiative_id: int = Field(foreign_key="initiatives.id", nullable=False)
    author_id: int = Field(foreign_key="users.id", nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    initiative: Optional[Initiative] = Relationship(back_populates="comments")


class InitiativeEnrollment(SQLModel, table=True):
    __tablename__ = "initiative_enrollments"

    id: Optional[int] = Field(default=None, primary_key=True)
    initiative_id: int = Field(foreign_key="initiatives.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    initiative: Optional[Initiative] = Relationship(back_populates="enrollments")


class InitiativeRating(SQLModel, table=True):
    __tablename__ = "initiative_ratings"

    id: Optional[int] = Field(default=None, primary_key=True)
    initiative_id: int = Field(foreign_key="initiatives.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    score: int = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    initiative: Optional[Initiative] = Relationship(back_populates="ratings")


class InitiativeSchedule(SQLModel, table=True):
    __tablename__ = "initiative_schedule"

    id: Optional[int] = Field(default=None, primary_key=True)
    initiative_id: int = Field(foreign_key="initiatives.id", nullable=False)
    weekday: str = Field(max_length=20)
    start_time: str = Field(max_length=10)
    end_time: str = Field(max_length=10)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    initiative: Optional[Initiative] = Relationship(back_populates="schedules")


# ============================================================
# NOTIFICAÇÕES
# ============================================================

class Notification(SQLModel, table=True):
    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    message: str = Field(nullable=False)
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    user: Optional[User] = Relationship(back_populates="notifications")


# ============================================================
# ARTIGOS
# ============================================================

class Article(SQLModel, table=True):
    __tablename__ = "articles"

    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="users.id", nullable=False)
    title: str = Field(max_length=200, nullable=False)
    content: str = Field(nullable=False)
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    author: Optional[User] = Relationship(back_populates="articles")


# ============================================================
# FÓRUM
# ============================================================

class ForumCategory(SQLModel, table=True):
    __tablename__ = "forum_categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, nullable=False)
    description: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    threads: List["ForumThread"] = Relationship(back_populates="category")


class ForumThread(SQLModel, table=True):
    __tablename__ = "forum_threads"

    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="forum_categories.id", nullable=False)
    author_id: int = Field(foreign_key="users.id", nullable=False)
    title: str = Field(max_length=200, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    category: Optional[ForumCategory] = Relationship(back_populates="threads")
    author: Optional[User] = Relationship(back_populates="forum_threads")
    posts: List["ForumPost"] = Relationship(back_populates="thread")


class ForumPost(SQLModel, table=True):
    __tablename__ = "forum_posts"

    id: Optional[int] = Field(default=None, primary_key=True)
    thread_id: int = Field(foreign_key="forum_threads.id", nullable=False)
    author_id: int = Field(foreign_key="users.id", nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    thread: Optional[ForumThread] = Relationship(back_populates="posts")
    author: Optional[User] = Relationship(back_populates="forum_posts")


# ============================================================
# LOG DE AUDITORIA
# ============================================================

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    action: str = Field(max_length=120, nullable=False)
    table_name: str = Field(max_length=100, nullable=False)
    record_id: Optional[int] = Field(default=None)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    user: Optional[User] = Relationship(back_populates="audit_logs")
