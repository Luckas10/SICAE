import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import "./EventGames.css";
import Header from "../../general/Header";
import Sidebar from "../../general/Sidebar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

export default function SingleGame({ gameId, onUpdated, onDeleted }) {
    const { user, loadingUser } = useUser();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        team1: "",
        team2: "",
        game_date: "",
        game_time: "",
        game_end_time: "",
        notes: "",
        event_id: "",
    });

    async function loadGame() {
        setLoading(true);
        try {
            const { data } = await api.get(`/games/${gameId}`);
            setGame(data);
        } catch (err) {
            console.error("Erro ao carregar jogo:", err);
            await Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar os jogos deste evento.",
                icon: "error",
                customClass: { popup: "error-alert" },
            });
            setGame(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!gameId) {
            setGame(null);
            setLoading(false);
            return;
        }
        loadGame();
    }, [gameId]);

    function startEdit() {
        if (!game) return;

        setForm({
            team1: game.team1 ?? "",
            team2: game.team2 ?? "",
            game_date: game.game_date ?? "",
            game_time: game.game_time?.substring(0, 5) || "",
            game_end_time: game.game_end_time?.substring(0, 5) || "",
            notes: game.notes || "",
            event_id: game.event_id ?? "",
        });

        setEditing(true);
    }

    function normalizeTimeToHHMMSS(t) {
        if (!t) return t;
        return t.length === 5 ? `${t}:00` : t;
    }

    async function handleUpdate() {
        try {
            if (!form.game_time || !form.game_end_time) {
                await Swal.fire("Atenção", "Informe o horário inicial e final.", "warning");
                return;
            }

            if (form.game_end_time < form.game_time) {
                await Swal.fire(
                    "Atenção",
                    "O horário final deve ser igual ou posterior ao horário inicial.",
                    "warning"
                );
                return;
            }

            const payload = {
                event_id: form.event_id,
                team1: form.team1,
                team2: form.team2,
                game_date: form.game_date,
                game_time: normalizeTimeToHHMMSS(form.game_time),
                game_end_time: normalizeTimeToHHMMSS(form.game_end_time),
                notes: form.notes,
            };

            const { data } = await api.put(`/games/${game.id}`, payload);

            setGame(data);
            setEditing(false);
            if (onUpdated) onUpdated(data);

            await Swal.fire("Sucesso!", "Jogo atualizado!", "success");
        } catch (err) {
            console.error("Erro no PUT:", err.response?.data || err);
            const msg = err?.response?.data?.detail || "Não foi possível atualizar o jogo.";
            await Swal.fire("Erro", msg, "error");
        }
    }

    function backEvent() {
        if (!game?.event_id) return;
        navigate(`/events/${game.event_id}`);
    }

    async function handleDelete() {
        const res = await Swal.fire({
            title: "Excluir jogo?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Excluir",
            cancelButtonText: "Cancelar",
            customClass: { popup: "comment-alert" },
        });

        if (!res.isConfirmed) return;

        try {
            await api.delete(`/games/${game.id}`);

            if (onDeleted) onDeleted(game.id);

            await Swal.fire("Excluído!", "O jogo foi removido.", "success");
        } catch (err) {
            console.error("Erro no DELETE:", err.response?.data || err);
            await Swal.fire("Erro", "Não foi possível excluir o jogo.", "error");
        }
    }

    if (loading) return <p className="event-games-loading">Carregando jogo...</p>;
    if (!game) return <p className="event-games-empty">Jogo não encontrado.</p>;

    const date = game.game_date ? new Date(game.game_date).toLocaleDateString("pt-BR") : "—";
    const time = game.game_time?.substring(0, 5) || "—";
    const endTime = game.game_end_time?.substring(0, 5) || "—";

    return (
        <>
            <Header />
            <main className="events-page">
                <Sidebar />

                <div className="event-game">
                    <h2>Detalhes do Jogo</h2>

                    <div className="event-game-info">
                        <p><strong>ID:</strong> {game.id}</p>
                        <p><strong>Evento:</strong> {game.event_id}</p>
                        <p><strong>Criado por:</strong> {game.creator_name || "—"}</p>
                        <p><strong>Registro:</strong> {game.created_at ? new Date(game.created_at).toLocaleString("pt-BR") : "—"}</p>
                    </div>

                    {!editing ? (
                        <div className="event-game-card">
                            <div className="event-game-header">
                                <span className="event-game-date">{date}</span>
                                <span className="event-game-time">{time} – {endTime}</span>
                            </div>

                            <div className="event-game-teams">
                                <div className="time"><strong>{game.team1}</strong></div>
                                <span className="event-game-x">X</span>
                                <div className="time"><strong>{game.team2}</strong></div>
                            </div>

                            {game.notes && (
                                <p className="event-game-notes">
                                    Observações: {game.notes}
                                </p>
                            )}

                            <div className="event-game-actions">
                                <button className="btn-edit" onClick={backEvent}>
                                    Voltar
                                </button>

                                {!loadingUser && user?.role === "Servidor" && (
                                    <>
                                        <button className="btn-edit" onClick={startEdit}>
                                            Editar
                                        </button>
                                        <button className="btn-delete" onClick={handleDelete}>
                                            Excluir
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="event-game-card edit-mode">
                            <label>Time 1:</label>
                            <input
                                value={form.team1}
                                onChange={(e) => setForm({ ...form, team1: e.target.value })}
                            />

                            <label>Time 2:</label>
                            <input
                                value={form.team2}
                                onChange={(e) => setForm({ ...form, team2: e.target.value })}
                            />

                            <label>Data:</label>
                            <input
                                type="date"
                                value={form.game_date}
                                onChange={(e) => setForm({ ...form, game_date: e.target.value })}
                            />

                            <label>Hora inicial:</label>
                            <input
                                type="time"
                                value={form.game_time}
                                onChange={(e) => setForm({ ...form, game_time: e.target.value })}
                            />

                            <label>Hora final:</label>
                            <input
                                type="time"
                                value={form.game_end_time}
                                onChange={(e) => setForm({ ...form, game_end_time: e.target.value })}
                            />

                            <label>Notas:</label>
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />

                            <div className="event-game-actions">
                                <button className="btn-save" onClick={handleUpdate}>
                                    Salvar
                                </button>

                                <button className="cancel" onClick={() => setEditing(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
