import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import api from "../services/api";
import Swal from "sweetalert2";

import "./Events.css";



export default function PlaceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlace() {
            try {
                const { data } = await api.get(`/places/${id}`);
                setPlace(data);
            } catch (err) {
                console.error("Erro ao buscar local:", err);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar local",
                    text: "Não foi possível carregar os detalhes deste local.",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchPlace();
    }, [id]);

    if (loading) {
        return <p className="event-details-loading">Carregando local...</p>;
    }

    if (!place) {
        return <p className="event-details-loading">Local não encontrado.</p>;
    }

    let createdAtDate = "";
    let createdAtTime = "";

    if (place.created_at) {
        const dt = new Date(place.created_at);
        createdAtDate = dt.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        createdAtTime = dt.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const capacityLabel =
        place.capacity && place.capacity > 0
            ? `${place.capacity} pessoas`
            : "Não informado";

    return (
        <>
            <Header />

            <div className="events-page">
                <Sidebar />

                <div className="events-content">
                    <div className="place-details-card">
                        <div className="place-details-header">
                            <h1>{place.name}</h1>

                            {(createdAtDate || createdAtTime) && (
                                <p className="place-details-subtitle">
                                    Cadastrado em {createdAtDate}
                                    {createdAtTime && ` às ${createdAtTime}`}
                                </p>
                            )}
                        </div>

                        {place.image_path && (
                            <div className="place-details-cover">
                                <img
                                    src={place.image_path}
                                    alt={place.name}
                                />
                            </div>
                        )}

                        <div className="place-details-body">
                            <div className="place-meta">
                                <div className="place-meta-item">
                                    <span className="place-meta-label">
                                        Capacidade
                                    </span>
                                    <span className="place-meta-value">
                                        {capacityLabel}
                                    </span>
                                </div>
                            </div>

                            {place.description && (
                                <div className="place-description">
                                    <h2>Descrição do local</h2>
                                    <p>{place.description}</p>
                                </div>
                            )}

                            <div className="place-details-actions">
                                <button
                                    type="button"
                                    className="event-button-secondary"
                                    onClick={() => navigate("/places")}
                                >
                                    Voltar para a lista de locais
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
