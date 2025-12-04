import eventVolei from "../../assets/eventsIcons/eventVolei.png";
import eventAtletismo from "../../assets/eventsIcons/eventAtletismo.png";
import eventBadminton from "../../assets/eventsIcons/eventBadminton.png";
import eventTenis from "../../assets/eventsIcons/eventTenis.png";
import eventXadrez from "../../assets/eventsIcons/eventXadrez.png";

export default function SportsFilterButton({
    label,
    isActive,
    onClick,
    alt = "Esporte",
}) {
    return (
        <button
            type="button"
            className={`sport-filter-btn ${isActive ? "active" : ""}`}
            onClick={onClick}
        >
            <img src={eventVolei} alt={alt} />
            <span className="sport-filter-label">{label}</span>
        </button>
    );
}
