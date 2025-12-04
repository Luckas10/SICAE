import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SportsFilterButton({
    label,
    image,
    icon,
    className,
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
            <img src={image} alt={alt} />

            {icon && (
                <FontAwesomeIcon
                    icon={icon}
                    className={className}
                />
            )}

            <span className="sport-filter-label">{label}</span>
        </button>
    );
}
