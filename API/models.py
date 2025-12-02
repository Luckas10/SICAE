from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List


class Role(str, Enum):
    aluno = "Aluno"
    servidor = "Servidor"
    gestor = "Gestor"
    admin = "Admin"

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    role: Role = Field(default=Role.aluno, nullable=False)
    full_name: str = Field(max_length=150, nullable=False)
    email: str = Field(unique=True, nullable=False, index=True)
    password_hash: str = Field(nullable=False)
    profile_image: Optional[str] = Field(default=None)
    theme: str = Field(default="light", max_length=20, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    events: List["Event"] = Relationship(back_populates="creator")
    comments: List["EventComment"] = Relationship(back_populates="author")
    notifications: List["Notification"] = Relationship(back_populates="user")
    audit_logs: List["AuditLog"] = Relationship(back_populates="user")

    news_articles: List["NewsArticle"] = Relationship(back_populates="creator")

class Local(SQLModel, table=True):
    __tablename__ = "locals"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=120, nullable=False)
    description: Optional[str] = Field(default=None)
    capacity: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    events: List["Event"] = Relationship(back_populates="local")
    reservations: List["LocalReservation"] = Relationship(back_populates="local")

class Event(SQLModel, table=True):
    __tablename__ = "events"

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="users.id")
    local_id: Optional[int] = Field(default=None, foreign_key="locals.id")
    title: str = Field(max_length=120)
    description: Optional[str] = Field(default=None)
    start_date: datetime = Field()
    end_date: datetime = Field()
    category: Optional[str] = Field(default=None, max_length=50)
    cover_image: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    creator: Optional[User] = Relationship(back_populates="events")
    local: Optional[Local] = Relationship(back_populates="events")
    comments: List["EventComment"] = Relationship(back_populates="event")
    ratings: List["EventRating"] = Relationship(back_populates="event")
    registrations: List["EventRegistration"] = Relationship(back_populates="event")

class LocalReservation(SQLModel, table=True):
    __tablename__ = "local_reservations"

    id: Optional[int] = Field(default=None, primary_key=True)
    local_id: int = Field(foreign_key="locals.id")
    user_id: int = Field(foreign_key="users.id")
    purpose: str = Field(max_length=120)
    start_time: datetime
    end_time: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    local: Optional[Local] = Relationship(back_populates="reservations")
    user: Optional[User] = Relationship()

class EventComment(SQLModel, table=True):
    __tablename__ = "event_comments"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id")
    author_id: int = Field(foreign_key="users.id")
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    event: Optional[Event] = Relationship(back_populates="comments")
    author: Optional[User] = Relationship(back_populates="comments")

class EventRating(SQLModel, table=True):
    __tablename__ = "event_ratings"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    score: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    event: Optional[Event] = Relationship(back_populates="ratings")

class EventRegistration(SQLModel, table=True):
    __tablename__ = "event_registrations"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    event: Optional[Event] = Relationship(back_populates="registrations")

class Notification(SQLModel, table=True):
    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    message: str
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: Optional[User] = Relationship(back_populates="notifications")

class NewsArticle(SQLModel, table=True):
    __tablename__ = "news_articles"

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="users.id")
    title: str = Field(max_length=120)
    content: Optional[str] = Field(default=None)
    add_info: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=50)
    cover_image: Optional[str] = Field(default=None)
    priority: str = Field(default=None, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    creator: Optional[User] = Relationship(back_populates="news_articles")

    comments: List["NewsComment"] = Relationship(back_populates="article")
    ratings: List["NewsRating"] = Relationship(back_populates="article")
    registrations: List["NewsRegistration"] = Relationship(back_populates="article")

class NewsComment(SQLModel, table=True):
    __tablename__ = "news_comments"

    id: Optional[int] = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="news_articles.id")
    author_id: int = Field(foreign_key="users.id")
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    article: Optional[NewsArticle] = Relationship(back_populates="comments")
    author: Optional[User] = Relationship()

class NewsRating(SQLModel, table=True):
    __tablename__ = "news_ratings"

    id: Optional[int] = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="news_articles.id")
    user_id: int = Field(foreign_key="users.id")
    score: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    article: Optional[NewsArticle] = Relationship(back_populates="ratings")

class NewsRegistration(SQLModel, table=True):
    __tablename__ = "news_registrations"

    id: Optional[int] = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="news_articles.id")
    user_id: int = Field(foreign_key="users.id")
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    article: Optional[NewsArticle] = Relationship(back_populates="registrations")

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    action: str = Field(max_length=120)
    table_name: str = Field(max_length=100)
    record_id: Optional[int] = Field(default=None)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: Optional[User] = Relationship(back_populates="audit_logs")