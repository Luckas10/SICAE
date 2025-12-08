export default function EventActions({
    onBackToList,
    onAddGame,
    onDelete,
    deleting,
}) {
    return (
        <div className="event-actions">
            <button
                type="button"
                className="event-button-secondary"
                onClick={onBackToList}
            >
                Voltar para lista
            </button>

            <button
                type="button"
                className="event-button-secondary"
                onClick={onAddGame}
            >
                + Adicionar Jogo
            </button>

            <button
                type="button"
                className="event-button-danger"
                onClick={onDelete}
                disabled={deleting}
            >
                {deleting ? "Excluindo..." : "Excluir evento"}
            </button>
        </div>
    );
}
