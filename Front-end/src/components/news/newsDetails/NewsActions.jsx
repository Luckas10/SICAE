import { useNavigate } from "react-router-dom";

export default function NewsActions({ onBack, onDelete, deleting, onEdit }) {
    const navigate = useNavigate();

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
                className="news-button-secondary"
                onClick={onEdit}
            >
                Editar notícia
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