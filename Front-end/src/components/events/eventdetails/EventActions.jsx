import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

export default function EventActions({
    onBackToList,
    onAddGame,
    onDelete,
    deleting,
    onEdit
}) {
    const { user, loadingUser } = useUser();
    const navigate = useNavigate();

    return (
        <div className="event-actions">
            <button
                type="button"
                className="event-button-secondary"
                onClick={onBackToList}
            >
                Voltar
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
                        className="event-button-secondary"
                        onClick={onEdit}
                    >
                        Editar evento
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
