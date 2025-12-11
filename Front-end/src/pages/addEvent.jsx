import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useEffect, useState } from "react";

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
    const [category, setCategory] = useState("futsal");
    const [description, setDescription] = useState("");

    const [isInitiation, setIsInitiation] = useState(false);
    const [coverImage, setCoverImage] = useState(null);

    // Locais
    const [locals, setLocals] = useState([]);
    const [localId, setLocalId] = useState("");

    // Modal de novo local
    const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
    const [placeName, setPlaceName] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [placeCapacity, setPlaceCapacity] = useState("");
    const [placeImage, setPlaceImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadLocals() {
            try {
                const res = await api.get("/locals");
                setLocals(res.data || []);
            } catch (error) {
                console.error("Erro ao carregar locais:", error);
            }
        }

        loadLocals();
    }, []);

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

    const handleSaveLocal = async (e) => {
        e.preventDefault();

        if (!placeName.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nome obrigatório",
                text: "Informe um nome para o local.",
            });
            return;
        }

        const capacityNum = placeCapacity ? Number(placeCapacity) : 0;

        if (placeCapacity && Number.isNaN(capacityNum)) {
            Swal.fire({
                icon: "warning",
                title: "Capacidade inválida",
                text: "Informe um número válido para a capacidade.",
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

            const res = await api.post("/locals", payload);
            const created = res.data;

            // Atualiza lista de locais e já seleciona o novo
            setLocals((prev) => [...prev, created]);
            setLocalId(String(created.id));
            setIsPlaceModalOpen(false);

            await Swal.fire({
                icon: "success",
                title: "Local cadastrado com sucesso!",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
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
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const safeTime = time || "00:00";

            const payload = {
                local_id: localId ? Number(localId) : null,
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

                            <label htmlFor="local">Local</label>
                            <div className="input-icon">
                                <select
                                    id="local"
                                    value={localId}
                                    onChange={(e) => setLocalId(e.target.value)}
                                >
                                    <option value="">
                                        Selecione um local
                                    </option>
                                    {locals.map((local) => (
                                        <option key={local.id} value={local.id}>
                                            {local.name}
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

                            {/* Capa do evento */}
                            <EventCoverField
                                value={coverImage}
                                onChange={setCoverImage}
                                label="Adicionar capa do evento"
                                inputId="event-cover-input"
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

                            <form onSubmit={handleSaveLocal}>
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
                                    {/* Aqui usamos o mesmo componente, mas com id e label próprios */}
                                    <EventCoverField
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
                                    <button
                                        type="submit"
                                        className="modal-btn save"
                                    >
                                        Salvar local
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
