// src/pages/EventDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import api from "../services/api";
import Swal from "sweetalert2";
import "./Events.css";

import {
    CATEGORY_CONFIG,
    DEFAULT_CATEGORY,
} from "../constants/eventCategories";

import EventDetailsHeader from "../components/events/eventdetails/EventDetailsHeader.jsx";
import EventCover from "../components/events/eventdetails/EventCover.jsx";
import EventMeta from "../components/events/eventdetails/EventMeta.jsx";
import EventDescription from "../components/events/eventdetails/EventDescription.jsx";
import EventActions from "../components/events/eventdetails/EventActions.jsx";
import EventGames from "../components/events/eventdetails/EventGames.jsx";

import EventsComments from "../components/events/eventdetails/EventComments.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loadingUser } = useUser();

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
                popup: "logout-alert",
            },
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
                    popup: "success-alert",
                },
            });

            navigate("/events");
        } catch (err) {
            console.error("Erro ao excluir evento:", err);

            Swal.fire({
                icon: "error",
                title: "Erro ao excluir",
                text: "Não foi possível excluir o evento. Tente novamente.",
                customClass: {
                    popup: "error-alert",
                },
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
                        <EventDetailsHeader
                            categoryConfig={cfg}
                            title={event.title}
                            creatorName={event.creator_name}
                            publishedDate={publishedDate}
                            publishedTime={publishedTime}
                        />

                        <EventCover
                            src={event.cover_image}
                            alt={event.title}
                        />

                        <div className="event-details-body">
                            <EventMeta
                                eventDate={eventDate}
                                eventTime={eventTime}
                                localId={event.local_id}
                            />

                            <EventDescription description={event.description} />

                            <EventActions
                                onBackToList={() => navigate("/events")}
                                onAddGame={() => navigate("/events/games")}
                                onDelete={handleDelete}
                                deleting={deleting}
                            />
                        </div>
                        
                        

                        <EventsComments eventId={event.id} currentUser={user}/>
                    </div>
                </div>
            </div>
        </>
    );
}
