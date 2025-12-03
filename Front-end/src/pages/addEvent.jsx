import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

import EventCoverField from "../components/events/addevent/EventCoverField.jsx";
import EventCategorySelect from "../components/events/addevent/EventCategorySelect.jsx";
import EventInitiationToggle from "../components/events/addevent/EventInitiationToggle.jsx";

export default function AddEvent() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("futsal");
    const [description, setDescription] = useState("");

    const [isInitiation, setIsInitiation] = useState(false);
    const [coverImage, setCoverImage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const safeTime = time || "00:00";

            const payload = {
                local_id: null,
                title,
                description,
                start_date: `${date}T${safeTime}`,
                end_date: `${date}T${safeTime}`,
                category,
                cover_image: coverImage || null,
                is_initiation: isInitiation,
            };

            await api.post("/events", payload);

            navigate("/events");

            Swal.fire({
                icon: "success",
                title: "Evento criado com sucesso!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: "success-alert",
                },
            });
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            const msg =
                error?.response?.data?.detail ||
                "Não foi possível criar o evento. Tente novamente.";

            Swal.fire({
                icon: "error",
                title: "Erro ao criar evento",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: {
                    popup: "error-alert",
                },
            });
        }
    };

    const handleCancel = () => {
        navigate("/events");
    };

    return (
        <>
            <Header />

            <div className="events-page">
                <Sidebar />

                <div className="addEvents-content">
                    <h2>Criar Evento</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="event-colum">
                            <label htmlFor="titulo">Título</label>
                            <div className="input-icon">
                                <FontAwesomeIcon icon={faFont} className="icon" />
                                <input
                                    type="text"
                                    id="titulo"
                                    placeholder="Título do evento"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <label htmlFor="data">Data</label>
                            <div className="input-icon">
                                <input
                                    type="date"
                                    id="data"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <label htmlFor="hora">Horário</label>
                            <div className="input-icon">
                                <input
                                    type="time"
                                    id="hora"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>

                            <label htmlFor="local">Localização</label>
                            <div className="input-icon">
                                <input
                                    type="text"
                                    id="local"
                                    placeholder="Local do evento"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <EventCoverField
                                value={coverImage}
                                onChange={setCoverImage}
                            />

                            <EventCategorySelect
                                value={category}
                                onChange={setCategory}
                            />
                            
                            <EventInitiationToggle
                                checked={isInitiation}
                                onChange={setIsInitiation}
                            />

                        </div>

                        <div className="event-colum">
                            <div className="textarea-icon">
                                <label htmlFor="conteudo">Descrição</label>

                                <textarea
                                    id="conteudo"
                                    placeholder="Descrição do evento..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="event-button">
                                <button type="submit">Salvar</button>
                                <button
                                    type="button"
                                    style={{
                                        backgroundColor: "white",
                                        color: "green",
                                    }}
                                    onClick={handleCancel}
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
