export default function EventCover({ src, alt }) {
    if (!src) return null;

    return (
        <div className="event-details-cover">
            <img src={src} alt={alt} />
        </div>
    );
}
