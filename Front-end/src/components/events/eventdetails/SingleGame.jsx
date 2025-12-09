import { useState, useEffect } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import "./EventGames.css"; 
import Header from "../../general/Header";
import Sidebar from "../../general/Sidebar";
import { useNavigate } from "react-router-dom";

export default function SingleGame({ gameId, onUpdated, onDeleted }) {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();


    const [form, setForm] = useState({
        team1: "",
        team2: "",
        game_date: "",
        game_time: "",
        location: "",
        notes: "",
        event_id: "", 
    });


    async function loadGame() {
        try {
            const { data } = await api.get(`/games/${gameId}`);
            setGame(data);
        } catch (err) {
            console.error("Erro ao carregar jogo:", err);
            Swal.fire("Erro", "Não foi possível carregar o jogo.", "error");
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (gameId) loadGame();
    }, [gameId]);

    function startEdit() {
        if (!game) return;
        setForm({
            team1: game.team1,
            team2: game.team2,
            game_date: game.game_date,
            game_time: game.game_time.substring(0, 5),
            location: game.location || "",
            notes: game.notes || "",
            event_id: game.event_id, 
        });

        setEditing(true);
    }

    async function handleUpdate() {
    try {
        const payload = {
            ...form,
            game_time: form.game_time.length === 5 
                ? `${form.game_time}:00` 
                : form.game_time,
        };

        console.log("Enviando PUT:", payload);

        const { data } = await api.put(`/games/${game.id}`, form);
        setGame(data);
        setEditing(false);

        Swal.fire("Sucesso!", "Jogo atualizado!", "success");
    } catch (err) {
        console.error("Erro no PUT:", err.response?.data || err);
        Swal.fire("Erro", "Não foi possível atualizar o jogo.", "error");
        
    }
}

    async function backEvent() {
        navigate(`/events/${game.event_id}`);
    };
    async function handleDelete() {
        const res = await Swal.fire({
            title: "Excluir jogo?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Excluir",
            cancelButtonText: "Cancelar",
        });

        if (!res.isConfirmed) return;

        try {
            await api.delete(`/games/${game.id}`);

            if (onDeleted) onDeleted(game.id);

            Swal.fire("Excluído!", "O jogo foi removido.", "success");
        } catch (err) {
            Swal.fire("Erro", "Não foi possível excluir o jogo.", "error");
        }
    }

    if (loading) return <p className="event-games-loading">Carregando jogo...</p>;
    if (!game) return <p className="event-games-empty">Jogo não encontrado.</p>;

    
    const date = new Date(game.game_date).toLocaleDateString("pt-BR");
    const time = game.game_time.substring(0, 5);

    return (
        <>
        <Header/>
        <div className="events-page">
            <Sidebar/>
            <div className="event-game">
            <h2>Detalhes do Jogo</h2>
            <div className="event-game-info">
                <p><strong>ID:</strong> {game.id}</p>
                <p><strong>Evento:</strong> {game.event_id}</p>
                <p><strong>Criado por:</strong> {game.creator_name || "—"}</p>
                <p><strong>Registro:</strong> {new Date(game.created_at).toLocaleString("pt-BR")}</p>
            </div>


            {!editing ? (
                <div className="event-game-card">

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

                    {/* BOTÕES */}
                    <div className="event-game-actions">
                        <button className="btn-edit" onClick={backEvent}>
                            Voltar
                        </button>
                        <button className="btn-edit" onClick={startEdit}>
                            Editar
                        </button>
                        <button className="btn-delete" onClick={handleDelete}>
                            Excluir
                        </button>
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

                    <label>Hora:</label>
                    <input
                        type="time"
                        value={form.game_time}
                        onChange={(e) => setForm({ ...form, game_time: e.target.value })}
                    />

                    <label>Local:</label>
                    <input
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
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

                        <button className="btn-cancel" onClick={() => setEditing(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
        </>
        
    );
}
