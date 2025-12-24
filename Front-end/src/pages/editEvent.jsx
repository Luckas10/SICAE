import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

import CoverField from "../components/general/CoverField.jsx";
import EventCategorySelect from "../components/events/addevent/EventCategorySelect.jsx";
import EventInitiationToggle from "../components/events/addevent/EventInitiationToggle.jsx";

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [category, setCategory] = useState("futsal");
    const [description, setDescription] = useState("");

    const [isInitiation, setIsInitiation] = useState(false);
    const [coverImage, setCoverImage] = useState(null);

    const [places, setPlaces] = useState([]);
    const [placeId, setPlaceId] = useState("");

    const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
    const [placeName, setPlaceName] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [placeCapacity, setPlaceCapacity] = useState("");
    const [placeImage, setPlaceImage] = useState(null);

    useEffect(() => {
        async function loadPlaces() {
            try {
                const res = await api.get("/places");
                setPlaces(res.data || []);
            } catch (error) {
                console.error("Erro ao carregar locais:", error);
            }
        }

        loadPlaces();
    }, []);

    function pad2(n) {
        return String(n).padStart(2, "0");
    }

    function formatLocalDate(d) {
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    }

    function formatLocalTime(d) {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }

    useEffect(() => {
        async function loadEvent() {
            try {
                const response = await api.get(`/events/${id}`);
                const data = response.data;

                setTitle(data.title || "");
                setDescription(data.description || "");
                setCategory(data.category || "futsal");
                setIsInitiation(!!data.is_initiation);
                setCoverImage(data.cover_image || null);

                if (data.place_id !== undefined && data.place_id !== null) {
                    setPlaceId(String(data.place_id));
                } else {
                    setPlaceId("");
                }

                if (data.start_date) {
                    const start = new Date(data.start_date);
                    setDate(formatLocalDate(start));
                    setStartTime(formatLocalTime(start));
                }

                if (data.end_date) {
                    const end = new Date(data.end_date);
                    setEndDate(formatLocalDate(end));
                    setEndTime(formatLocalTime(end));
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar evento",
                    customClass: { popup: "error-alert" },
                });
            }
        }

        loadEvent();
    }, [id]);

    const handleOpenPlaceModal = () => {
        setPlaceName("");
        setPlaceDescription("");
        setPlaceCapacity("");
        setPlaceImage(null);
        setIsPlaceModalOpen(true);
    };

    const handleClosePlaceModal = () => {
        setIsPlaceModalOpen(false);
    };

    const handleSavePlace = async (e) => {
        e.preventDefault();

        if (!placeName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nome obrigatório",
                text: "Informe um nome para o local.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        const capacityNum = placeCapacity ? Number(placeCapacity) : 0;

        if (placeCapacity && Number.isNaN(capacityNum)) {
            Swal.fire({
                icon: "warning",
                title: "Capacidade inválida",
                text: "Informe um número válido para a capacidade.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        try {
            const payload = {
                name: placeName.trim(),
                description: placeDescription.trim() || "",
                capacity: capacityNum,
                image_path: placeImage || null,
            };

            const res = await api.post("/places", payload);
            const created = res.data;

            setPlaces((prev) => [...prev, created]);
            setPlaceId(String(created.id));
            setIsPlaceModalOpen(false);

            await Swal.fire({
                icon: "success",
                title: "Local cadastrado com sucesso!",
                timer: 3200,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
                customClass: { popup: "success-alert" },
            });
        } catch (error) {
            console.error("Erro ao cadastrar local:", error);

            const msg =
                error?.response?.data?.detail ||
                "Não foi possível cadastrar o local. Tente novamente.";

            await Swal.fire({
                icon: "error",
                title: "Erro ao cadastrar local",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: { popup: "error-alert" },
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date) {
            Swal.fire({
                icon: "warning",
                title: "Data de início obrigatória",
                text: "Informe a data de início do evento.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        if (!endDate) {
            Swal.fire({
                icon: "warning",
                title: "Data de término obrigatória",
                text: "Informe a data de término do evento.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        if (!startTime) {
            Swal.fire({
                icon: "warning",
                title: "Hora de início obrigatória",
                text: "Informe o horário de início do evento.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        if (!endTime) {
            Swal.fire({
                icon: "warning",
                title: "Hora de término obrigatória",
                text: "Informe o horário de término do evento.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        const startDateTimeStr = `${date}T${startTime}`;
        const endDateTimeStr = `${endDate}T${endTime}`;

        const startDateObj = new Date(startDateTimeStr);
        const endDateObj = new Date(endDateTimeStr);

        if (endDateObj < startDateObj) {
            Swal.fire({
                icon: "warning",
                title: "Intervalo de datas/horas inválido",
                text: "A data/hora de término deve ser igual ou posterior à data/hora de início.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        try {
            const payload = {
                place_id: placeId ? Number(placeId) : null,
                title,
                description,
                start_date: startDateTimeStr,
                end_date: endDateTimeStr,
                category,
                cover_image: coverImage || null,
                is_initiation: isInitiation,
            };

            await api.put(`/events/${id}`, payload);

            Swal.fire({
                icon: "success",
                title: "Evento atualizado!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3200,
                timerProgressBar: true,
                customClass: {
                    popup: "success-alert",
                },
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
                                    maxLength="150"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <label>Datas</label>
                            <div
                                className="event-dates-row"
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    width: "100%",
                                }}
                            >
                                <div className="input-icon" style={{ flex: 1 }}>
                                    <input
                                        type="date"
                                        id="data-inicio"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div className="input-icon" style={{ flex: 1 }}>
                                    <input
                                        type="date"
                                        id="data-fim"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <label>Horários</label>
                            <div
                                className="event-hours-row"
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    width: "100%",
                                }}
                            >
                                <div className="input-icon" style={{ flex: 1 }}>
                                    <input
                                        type="time"
                                        id="hora-inicio"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>

                                <div className="input-icon" style={{ flex: 1 }}>
                                    <input
                                        type="time"
                                        id="hora-fim"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <label htmlFor="place">Local</label>
                            <div className="input-icon">
                                <select
                                    id="place"
                                    value={placeId}
                                    onChange={(e) => setPlaceId(e.target.value)}
                                >
                                    <option value="">Selecione um local</option>
                                    {places.map((place) => (
                                        <option key={place.id} value={place.id}>
                                            {place.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                className="image-selector-button place-add-button"
                                onClick={handleOpenPlaceModal}
                            >
                                + Cadastrar novo local
                            </button>

                            <CoverField
                                value={coverImage}
                                onChange={setCoverImage}
                                label="Adicionar capa do evento"
                                inputId="event-cover-input"
                            />

                            <EventCategorySelect value={category} onChange={setCategory} />

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
                                    maxLength="150"
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="event-button">
                                <button type="submit">Salvar</button>
                                <button
                                    type="button"
                                    id="event-button-cancel"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {isPlaceModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content place-modal">
                            <h3>Cadastrar novo local</h3>

                            <form onSubmit={handleSavePlace}>
                                <div className="place-input-row">
                                    <label htmlFor="place-name">Nome do local</label>
                                    <input
                                        id="place-name"
                                        type="text"
                                        value={placeName}
                                        onChange={(e) => setPlaceName(e.target.value)}
                                        placeholder="Ex: Quadra principal"
                                    />
                                </div>

                                <div className="place-input-row">
                                    <label htmlFor="place-description">Descrição</label>
                                    <textarea
                                        id="place-description"
                                        value={placeDescription}
                                        onChange={(e) => setPlaceDescription(e.target.value)}
                                        placeholder="Descrição do local (opcional)"
                                    />
                                </div>

                                <div className="place-input-row">
                                    <label htmlFor="place-capacity">Capacidade</label>
                                    <input
                                        id="place-capacity"
                                        type="number"
                                        min="0"
                                        value={placeCapacity}
                                        onChange={(e) => setPlaceCapacity(e.target.value)}
                                        placeholder="Capacidade (opcional)"
                                    />
                                </div>

                                <div className="place-input-row">
                                    <CoverField
                                        value={placeImage}
                                        onChange={setPlaceImage}
                                        label="Imagem do local"
                                        inputId="place-cover-input"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="modal-btn cancel"
                                        onClick={handleClosePlaceModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="modal-btn save">
                                        Salvar local
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
