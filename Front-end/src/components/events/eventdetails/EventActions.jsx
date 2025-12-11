import { useUser } from "../../../context/UserContext";

export default function EventActions({
    onBackToList,
    onAddGame,
    onDelete,
    deleting,
}) {
    const { user, loadingUser } = useUser();

    return (
        <div className="event-actions">
            <button
                type="button"
                className="event-button-secondary"
                onClick={onBackToList}
            >
                Voltar para eventos
            </button>

            {!loadingUser && user?.role === "Servidor" && (
                <>
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
                </>
            )}

        </div>
    );
}
