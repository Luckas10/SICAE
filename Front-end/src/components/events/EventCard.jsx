import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../../constants/timeAgo";
import news1 from "../../assets/news1.jpg";
import { CATEGORY_CONFIG, EVENT_CATEGORY } from "../../constants/eventCategories";

function splitApiDateTime(dt) {
    if (!dt || typeof dt !== "string") return { date: "", time: "" };
    const [, tRaw = ""] = dt.split("T");
    return { time: tRaw.slice(0, 5) };
}

function formatEventTime(ev) {
    const s = splitApiDateTime(ev.start_date);
    const e = splitApiDateTime(ev.end_date);

    if (s.time && e.time) return `${s.time} – ${e.time}`;
    if (s.time) return s.time;
    return "—";
}

export default function EventCard({ event, placeName }) {
    const cfg = CATEGORY_CONFIG[event.category] || EVENT_CATEGORY;

    const timeText = formatEventTime(event);

    const placeText =
        placeName ||
        event.place_name ||
        "Carregando local...";

    return (
        <NavLink to={`/events/${event.id}`} className="event-card">
            <img src={event.cover_image || news1} alt={event.title} />

            <p className="sportsNewsId">
                <FontAwesomeIcon icon={cfg.icon} className={cfg.className} />{" "}
                {cfg.label} {event.is_initiation && " | INICIAÇÃO ESPORTIVA"}
            </p>

            <h5>{event.title}</h5>

            <div className="event-card-meta">
                <span className="event-card-meta-item">{timeText}</span>
                <span className="event-card-meta-sep">•</span>
                <span className="event-card-meta-item">{placeText}</span>
            </div>

            <p className="timeAgoInfo">{timeAgo(event.created_at)}</p>
        </NavLink>
    );
}
