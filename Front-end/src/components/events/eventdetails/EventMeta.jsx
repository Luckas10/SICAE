export default function EventMeta({
    eventDate,
    eventTime,
    endEventDate,
    endEventTime,
    placeName,
}) {
    if (!eventDate && !eventTime && !endEventDate && !endEventTime && !placeName) {
        return null;
    }

    return (
        <div className="event-meta">
            {(eventDate || eventTime) && (
                <div className="event-meta-item">
                    <span className="event-meta-label">Início</span>
                    <span className="event-meta-value">
                        {eventDate}
                        {eventTime && ` • ${eventTime}`}
                    </span>
                </div>
            )}

            {(endEventDate || endEventTime) && (
                <div className="event-meta-item">
                    <span className="event-meta-label">Fim</span>
                    <span className="event-meta-value">
                        {endEventDate}
                        {endEventTime && ` • ${endEventTime}`}
                    </span>
                </div>
            )}

            {placeName && (
                <div className="event-meta-item">
                    <span className="event-meta-label">Local</span>
                    <span className="event-meta-value">{placeName}</span>
                </div>
            )}
        </div>
    );
}
