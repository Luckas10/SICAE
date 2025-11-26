import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EventCard({ image, icon, iconClassName, label, title }) {
    return (
        <div className="event-card">
            <img src={image} alt={title} />
            <p className="sportsNewsId">
                <FontAwesomeIcon icon={icon} className={iconClassName} /> {label}
            </p>
            <h5>{title}</h5>
        </div>
    );
}
