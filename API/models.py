from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone, timedelta, date, time
from enum import Enum
from typing import Optional, List


class Role(str, Enum):
    aluno = "Aluno"
    atleta = "Atleta"
    servidor = "Servidor"


def now_brazil_timezone():
    return datetime.now(timezone.utc) - timedelta(hours=3)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    role: Role = Field(default=Role.aluno, nullable=False)
    full_name: str = Field(max_length=150, nullable=False)
    email: str = Field(unique=True, nullable=False, index=True)
    password_hash: str = Field(nullable=False)
    profile_image: Optional[str] = Field(default=None)
    theme: str = Field(default="light", max_length=20, nullable=False)
    created_at: datetime = Field(default_factory=now_brazil_timezone)
    updated_at: datetime = Field(default_factory=now_brazil_timezone)

    events: List["Event"] = Relationship(back_populates="creator")
    comments: List["EventComment"] = Relationship(back_populates="author")
    notifications: List["Notification"] = Relationship(back_populates="user")
    audit_logs: List["AuditLog"] = Relationship(back_populates="user")

    news_articles: List["NewsArticle"] = Relationship(back_populates="creator")
    # CORRIGIDO: back_populates precisa apontar para "creator" em Game
    games: List["Game"] = Relationship(back_populates="creator")


class Place(SQLModel, table=True):
    __tablename__ = "places"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=120, nullable=False)
    description: Optional[str] = Field(default=None)
    capacity: int = Field(default=0)
    image_path: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    events: List["Event"] = Relationship(back_populates="place")
    reservations: List["PlaceReservation"] = Relationship(back_populates="place")


class Event(SQLModel, table=True):
    __tablename__ = "events"

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="users.id")
    place_id: Optional[int] = Field(default=None, foreign_key="places.id")
    title: str = Field(max_length=120)
    description: Optional[str] = Field(default=None)
    start_date: datetime = Field()
    end_date: datetime = Field()
    category: Optional[str] = Field(default=None, max_length=50)
    cover_image: Optional[str] = Field(default=None)
    created_at: datetime = Field(
        default_factory=now_brazil_timezone,
        nullable=False,
    )
    is_initiation: bool = Field(default=False, nullable=False)

    creator: Optional[User] = Relationship(back_populates="events")
    place: Optional[Place] = Relationship(back_populates="events")
    ratings: List["EventRating"] = Relationship(back_populates="event")
    registrations: List["EventRegistration"] = Relationship(back_populates="event")
    comments: List["EventComment"] = Relationship(
        back_populates="event",
        sa_relationship_kwargs={"cascade": "all, delete"},
    )
    games: List["Game"] = Relationship(back_populates="event")
    reservations: List["PlaceReservation"] = Relationship(
        back_populates="event",
        sa_relationship_kwargs={"cascade": "all, delete"},
    )


class PlaceReservation(SQLModel, table=True):
    __tablename__ = "place_reservations"

    id: Optional[int] = Field(default=None, primary_key=True)
    place_id: int = Field(foreign_key="places.id")
    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    purpose: str = Field(max_length=120)
    start_time: datetime
    end_time: datetime
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    place: Optional[Place] = Relationship(back_populates="reservations")
    user: Optional[User] = Relationship()
    event: Optional[Event] = Relationship(back_populates="reservations")


class EventComment(SQLModel, table=True):
    __tablename__ = "event_comments"

    id: Optional[int] = Field(default=None, primary_key=True)

    event_id: int = Field(foreign_key="events.id", nullable=False, ondelete="CASCADE")
    author_id: int = Field(foreign_key="users.id", nullable=False, ondelete="CASCADE")

    content: str
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    event: Optional["Event"] = Relationship(back_populates="comments")
    author: Optional[User] = Relationship(back_populates="comments")


class EventRating(SQLModel, table=True):
    __tablename__ = "event_ratings"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    score: int
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    event: Optional[Event] = Relationship(back_populates="ratings")


class EventRegistration(SQLModel, table=True):
    __tablename__ = "event_registrations"

    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id")
    user_id: int = Field(foreign_key="users.id")
    registered_at: datetime = Field(default_factory=now_brazil_timezone)

    event: Optional[Event] = Relationship(back_populates="registrations")


class Notification(SQLModel, table=True):
    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    message: str
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=now_brazil_timezone)

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
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    creator: Optional[User] = Relationship(back_populates="news_articles")

    comments: List["NewsComment"] = Relationship(
        back_populates="article",
        sa_relationship_kwargs={"cascade": "all, delete"},
    )

    ratings: List["NewsRating"] = Relationship(back_populates="article")
    registrations: List["NewsRegistration"] = Relationship(back_populates="article")


class NewsComment(SQLModel, table=True):
    __tablename__ = "news_comments"

    id: Optional[int] = Field(default=None, primary_key=True)

    article_id: int = Field(
        foreign_key="news_articles.id", nullable=False, ondelete="CASCADE"
    )

    author_id: int = Field(foreign_key="users.id", nullable=False, ondelete="CASCADE")

    content: str
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    article: Optional["NewsArticle"] = Relationship(back_populates="comments")
    author: Optional[User] = Relationship()


class NewsRating(SQLModel, table=True):
    __tablename__ = "news_ratings"

    id: Optional[int] = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="news_articles.id")
    user_id: int = Field(foreign_key="users.id")
    score: int
    created_at: datetime = Field(default_factory=now_brazil_timezone)

    article: Optional[NewsArticle] = Relationship(back_populates="ratings")


class NewsRegistration(SQLModel, table=True):
    __tablename__ = "news_registrations"

    id: Optional[int] = Field(default=None, primary_key=True)
    article_id: int = Field(foreign_key="news_articles.id")
    user_id: int = Field(foreign_key="users.id")
    registered_at: datetime = Field(default_factory=now_brazil_timezone)

    article: Optional[NewsArticle] = Relationship(back_populates="registrations")


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    action: str = Field(max_length=120)
    table_name: str = Field(max_length=100)
    record_id: Optional[int] = Field(default=None)
    timestamp: datetime = Field(default_factory=now_brazil_timezone)

    user: Optional[User] = Relationship(back_populates="audit_logs")


class Game(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int = Field(foreign_key="events.id")
    team1: str
    team2: str
    game_date: date
    game_time: time
    location: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    creator_id: Optional[int] = Field(default=None, foreign_key="users.id")

    # Lado "many" do relacionamento com User
    creator: Optional["User"] = Relationship(back_populates="games")

    # Lado "many" do relacionamento com Event
    event: Optional["Event"] = Relationship(back_populates="games")
