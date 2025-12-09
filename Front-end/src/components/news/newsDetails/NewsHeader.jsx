import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewsHeader({ title, addInfo, creator, date, categoryConfig }) {
    return (
        <div className="news-details-header">

            <span className="event-category-chip sportsNewsId">
                <FontAwesomeIcon
                    icon={categoryConfig.icon}
                    className={categoryConfig.className}
                />{" "}
                {categoryConfig.label}
            </span>

            <h1 style={{marginTop: "1rem"}}>{title}</h1>
            <h3>{addInfo}</h3>
            <p className="news-details-subtitle">
                Publicado por {creator} • {date}
            </p>
        </div>
    );
}