import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../../constants/timeAgo";
import news1 from "../../assets/news1.jpg";
import {
    CATEGORY_CONFIG,
    EVENT_CATEGORY,
} from "../../constants/eventCategories";


export default function EventCard({ event }) {
    const cfg = CATEGORY_CONFIG[event.category] || EVENT_CATEGORY;

    return (
        <NavLink
            to={`/events/${event.id}`}
            className="event-card"
        >
            <img
                src={event.cover_image || news1}
                alt={event.title}
            />
            <p className="sportsNewsId">
                <FontAwesomeIcon
                    icon={cfg.icon}
                    className={cfg.className}
                />{" "}
                {cfg.label} {event.is_initiation && " | INICIAÇÃO ESPORTIVA"}
            </p>
            <h5>{event.title}</h5>

            <p className="timeAgoInfo">{timeAgo(event.created_at)}</p>
        </NavLink>
    );
}
