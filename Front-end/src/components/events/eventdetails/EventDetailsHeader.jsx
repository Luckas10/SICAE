import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EventDetailsHeader({
    categoryConfig,
    title,
    creatorName,
    publishedDate,
    publishedTime,
}) {
    return (
        <div className="event-details-header">
            <span className="event-category-chip sportsNewsId">
                <FontAwesomeIcon
                    icon={categoryConfig.icon}
                    className={categoryConfig.className}
                />{" "}
                {categoryConfig.label}
            </span>

            <h1>{title}</h1>

            <p className="event-details-subtitle">
                Publicado por {creatorName}
                {publishedDate && (
                    <>
                        {" "}em {publishedDate}
                        {publishedTime && <> às {publishedTime}</>}
                    </>
                )}
            </p>
        </div>
    );
}
