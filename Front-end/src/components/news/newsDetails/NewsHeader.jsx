export default function NewsHeader({ title, addInfo, creator, date }) {
    return (
        <div className="news-details-header">
            <h1>{title}</h1>
            <h3>{addInfo}</h3>
            <p className="news-details-subtitle">
                Publicado por {creator} • {date}
            </p>
        </div>
    );
}