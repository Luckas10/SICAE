export default function NewsContent({ content }) {
    return (
        <div className="news-details-body">
            <div className="news-details-info">
                <p>
                    {content && content.trim().length > 0
                        ? content
                        : "Nenhum conteúdo foi cadastrado para esta notícia."}
                </p>
            </div>
        </div>
    );
}