import event1 from "../../assets/eventsIcons/event1.png";

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
            <img src={event1} alt={alt} />
            <span className="sport-filter-label">{label}</span>
        </button>
    );
}
