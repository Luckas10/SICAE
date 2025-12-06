import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./Events.css";
import {
    CATEGORY_CONFIG,
    DEFAULT_CATEGORY,
} from "../constants/eventCategories";

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                console.error("Erro ao buscar evento:", err);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar evento",
                    text: "Não foi possível carregar os detalhes deste evento.",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchEvent();
    }, [id]);

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Excluir evento?",
            text: "Essa ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
            customClass: {
                popup: "logout-alert"
            }
        });

        if (!result.isConfirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/events/${id}`);

            await Swal.fire({
                icon: "success",
                title: "Evento excluído",
                text: "O evento foi excluído com sucesso.",
                customClass: {
                    popup: "success-alert"
                }
            });

            navigate("/events");

        } catch (err) {
            console.error("Erro ao excluir evento:", err);

            Swal.fire({
                icon: "error",
                title: "Erro ao excluir",
                text: "Não foi possível excluir o evento. Tente novamente.",
                customClass: {
                    popup: "error-alert"
                }
            });
        } finally {
            setDeleting(false);
        }
    };


    if (loading) {
        return <p className="event-details-loading">Carregando evento...</p>;
    }

    if (!event) {
        return <p className="event-details-loading">Evento não encontrado.</p>;
    }

    const cfg = CATEGORY_CONFIG[event.category] || DEFAULT_CATEGORY;

    let publishedDate = "";
    let publishedTime = "";
    let eventDate = "";
    let eventTime = "";

    if (event.created_at) {
        const created = new Date(event.created_at);
        publishedDate = created.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        publishedTime = created.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (event.start_date) {
        const start = new Date(event.start_date);
        eventDate = start.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        eventTime = start.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }


    return (
        <>
            <Header />

            <div className="events-page">
                <Sidebar />

                <div className="events-content">
                    <div className="event-details">
                        <div className="event-details-header">
                            <span className="event-category-chip sportsNewsId">
                                <FontAwesomeIcon icon={cfg.icon} className={cfg.className} />{" "}
                                {cfg.label}
                            </span>
                            <h1>{event.title}</h1>
                            <p className="event-details-subtitle">
                                Publicado por {event.creator_name} • 
                                {publishedDate && (
                                    <>
                                        {" "}em {publishedDate}
                                        {publishedTime && <> às {publishedTime}</>}
                                    </>
                                )}
                            </p>

                        </div>

                        {event.cover_image && (
                            <div className="event-details-cover">
                                <img src={event.cover_image} alt={event.title} />
                            </div>
                        )}

                        <div className="event-details-body">
                            <div className="event-meta">
                                {eventDate && (
                                    <div className="event-meta-item">
                                        <span className="event-meta-label">Data do evento</span>
                                        <span className="event-meta-value">{eventDate}</span>
                                    </div>
                                )}

                                {eventTime && (
                                    <div className="event-meta-item">
                                        <span className="event-meta-label">Horário do evento</span>
                                        <span className="event-meta-value">{eventTime}</span>
                                    </div>
                                )}

                                {event.local_id && (
                                    <div className="event-meta-item">
                                        <span className="event-meta-label">Local</span>
                                        <span className="event-meta-value">
                                            Local #{event.local_id}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="event-details-info">
                                <h2>Descrição</h2>
                                <p>
                                    {event.description && event.description.trim().length > 0
                                        ? event.description
                                        : "Nenhuma descrição foi cadastrada para este evento."}
                                </p>
                            </div>

                            <div className="event-actions">
                                <button
                                    type="button"
                                    className="event-button-secondary"
                                    onClick={() => navigate("/events")}
                                >
                                    Voltar para lista
                                </button>
                                <button
                                    type="button"
                                    className="event-button-secondary"
                                    onClick={() => navigate("/events/games")}
                                >
                                    Adicionar jogo
                                </button>

                                <button
                                    type="button"
                                    className="event-button-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? "Excluindo..." : "Excluir evento"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
