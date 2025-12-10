import { useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

import Header from "../components/general/Header";
import Sidebar from "../components/general/Sidebar";
import "./EventGame.css";
import { useParams, useNavigate } from "react-router-dom";

export default function EventGame() {
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");

    const { id } = useParams();            // <-- ID do evento
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/games", {
                event_id: Number(id),   // <-- Agora está certo!
                team1,
                team2,
                game_date: date,
                game_time: time,
                location,
                notes,
            });

            Swal.fire("Jogo criado!", "", "success");

            // Redireciona de volta para a página do evento
            navigate(`/events/${id}`);
        } catch (error) {
            Swal.fire("Erro", "Não foi possível criar o jogo", "error");
        }
    };

    return (
        <>
            <Header />
            <div className="games-page">
                <Sidebar />

                <div className="games-content">
                    <h2>Criar jogo</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="game-colum">
                            <div className="game-div">
                                <label htmlFor="team1">Equipe 1</label>
                                <input
                                    id="team1"
                                    type="text"
                                    value={team1}
                                    onChange={(e) => setTeam1(e.target.value)}
                                />
                            </div>

                            <h1>X</h1>

                            <div className="game-div">
                                <label htmlFor="team2">Equipe 2</label>
                                <input
                                    id="team2"
                                    type="text"
                                    value={team2}
                                    onChange={(e) => setTeam2(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="date">Data</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />

                            <label htmlFor="time">Horário</label>
                            <input
                                type="time"
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />

                            <label htmlFor="local">Local</label>
                            <input
                                type="text"
                                id="local"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />

                            <label htmlFor="notes">Observações</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>

                            <div className="game-button">
                                <button type="submit">
                                    Salvar
                                </button>

                                <button
                                    type="button"
                                    id="event-button-cancel"
                                    onClick={() => navigate(`/events/${id}`)}
                                    
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
