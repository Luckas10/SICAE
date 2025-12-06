export default function NewsActions({ onBack, onDelete, deleting }) {
    return (
        <div className="news-actions">
            <button
                type="button"
                className="news-button-secondary"
                onClick={onBack}
            >
                Voltar para notícias
            </button>

            <button
                type="button"
                className="news-button-danger"
                onClick={onDelete}
                disabled={deleting}
            >
                {deleting ? "Excluindo..." : "Excluir notícia"}
            </button>
        </div>
    );
}