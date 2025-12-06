export default function NewsCover({ src, title }) {
    if (!src) return null;

    return (
        <div className="news-details-cover">
            <img src={src} alt={title} />
        </div>
    );
}