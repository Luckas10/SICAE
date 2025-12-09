import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import Swal from "sweetalert2";
import "./EventGames.css";

export default function EventGames({ eventId }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function loadGames() {
        try {
            const { data } = await api.get(`/games/event/${eventId}`);

            const ordered = data.sort((a, b) => {
                const da = new Date(a.game_date);
                const db = new Date(b.game_date);
                return da - db;
            });

            setGames(ordered);
        } catch (err) {
            console.error("Erro ao carregar jogos:", err);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar os jogos deste evento.",
                icon: "error",
                customClass: { popup: "games-alert" },
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (eventId) loadGames();
    }, [eventId]);

    if (loading) {
        return <p className="event-games-loading">Carregando jogos...</p>;
    }

    return (
        <div className="event-games">
            <h2>Jogos do Evento</h2>

            {games.length === 0 ? (
                <p className="event-games-empty">Nenhum jogo cadastrado.</p>
            ) : (
                <div className="event-games-list">
                    {games.map((game) => {
                        const date = game.game_date
                            ? new Date(game.game_date).toLocaleDateString("pt-BR")
                            : "—";

                        let time = "—";
                        if (typeof game.game_time === "string") {
                            time = game.game_time.substring(0, 5);
                        } else if (typeof game.game_time === "object" && game.game_time !== null) {
                            const h = String(game.game_time.hour).padStart(2, "0");
                            const m = String(game.game_time.minute).padStart(2, "0");
                            time = `${h}:${m}`;
                        }

                        return (
                            <div key={game.id} className="event-game-card">
                                <div className="event-game-header">
                                    <span className="event-game-date">{date}</span>
                                    <span className="event-game-time">{time}</span>
                                </div>

                                <div className="event-game-teams">
                                    <div className="time"><strong>{game.team1}</strong></div>
                                    <span className="event-game-x">X</span>
                                    <div className="time"><strong>{game.team2}</strong></div>
                                </div>

                                <p className="event-game-location">
                                    Local: <strong>{game.location || "—"}</strong>
                                </p>

                                {game.notes && (
                                    <p className="event-game-notes">
                                        Observações: {game.notes}
                                    </p>
                                )}

                                
                                <div className="event-game-actions">
                                    <button
                                        className="btn-details"
                                        onClick={() => navigate(`/games/${game.id}`)}
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
