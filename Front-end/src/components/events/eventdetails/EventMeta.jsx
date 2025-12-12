export default function EventMeta({ eventDate, eventTime, placeId }) {
    if (!eventDate && !eventTime && !placeId) return null;

    return (
        <div className="event-meta">
            {eventDate && (
                <div className="event-meta-item">
                    <span className="event-meta-label">Data do evento</span>
                    <span className="event-meta-value">{eventDate}</span>
                </div>
            )}

            {eventTime && (
                <div className="event-meta-item">
                    <span className="event-meta-label">Horário do evento</span>
                    <span className="event-meta-value">{eventTime}</span>
                </div>
            )}

            {placeId && (
                <div className="event-meta-item">
                    <span className="event-meta-label">Local</span>
                    <span className="event-meta-value">Local #{placeId}</span>
                </div>
            )}
        </div>
    );
}
