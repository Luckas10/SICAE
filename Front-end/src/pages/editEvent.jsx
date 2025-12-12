import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

import EventCoverField from "../components/events/addevent/EventCoverField.jsx";
import EventCategorySelect from "../components/events/addevent/EventCategorySelect.jsx";
import EventInitiationToggle from "../components/events/addevent/EventInitiationToggle.jsx";

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("futsal");
    const [description, setDescription] = useState("");

    const [isInitiation, setIsInitiation] = useState(false);
    const [coverImage, setCoverImage] = useState(null);

    useEffect(() => {
        async function loadEvent() {
            try {
                const response = await api.get(`/events/${id}`);
                const data = response.data;

                setTitle(data.title);
                setDescription(data.description || "");
                setLocation(data.local_name || "");
                setCategory(data.category || "futsal");

                if (data.start_date) {
                    const dt = new Date(data.start_date);
                    setDate(dt.toISOString().split("T")[0]);
                    setTime(dt.toISOString().split("T")[1].slice(0, 5));
                }

                setIsInitiation(data.is_initiation || false);
                setCoverImage(data.cover_image || null);

            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar evento",
                });
            }
        }

        loadEvent();
    }, [id]);

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
                cover_image: coverImage,
                is_initiation: isInitiation,
            };

            await api.put(`/events/${id}`, payload);

            Swal.fire({
                icon: "success",
                title: "Evento atualizado!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
            });

            navigate("/events");

        } catch (error) {
            console.error(error);

            const msg =
                error?.response?.data?.detail ||
                "Não foi possível atualizar o evento. Tente novamente.";

            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar evento",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
            });
        }
    };

    const handleCancel = () => {
        navigate("/events");
    };

    return (
        <>
            <Header />

            <main className="events-page">
                <Sidebar />

                <div className="addEvents-content">
                    <h2>Editar Evento</h2>

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
                                    style={{ backgroundColor: "white", color: "green" }}
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
