import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import api from "../services/api";
import Swal from "sweetalert2";

import "./Places.css";

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
                    customClass: {
                        popup: "error-alert",
                    },
                });
            } finally {
                setLoading(false);
            }
        }

        fetchPlace();
    }, [id]);

    if (loading) {
        return <p className="place-details-loading">Carregando local.</p>;
    }

    if (!place) {
        return <p className="place-details-loading">Local não encontrado.</p>;
    }

    let publishedDate = "";
    let publishedTime = "";

    if (place.created_at) {
        const created = new Date(place.created_at);
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

    const capacityLabel =
        place.capacity && Number(place.capacity) > 0
            ? `${place.capacity} pessoas`
            : "Não informado";

    return (
        <>
            <Header />

            <main className="places-page">
                <Sidebar />

                <div className="places-content">
                    <div className="place-details">
                        <div className="place-details-header">
                            <h1>{place.name}</h1>

                            {(publishedDate || publishedTime) && (
                                <p className="place-details-subtitle">
                                    Cadastrado em {publishedDate}
                                    {publishedTime ? ` às ${publishedTime}` : ""}
                                </p>
                            )}
                        </div>

                        <div className="place-details-cover">
                            <img src={place.image_path || "/img/building.webp"} alt={place.name} />
                        </div>

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

                                {place.id && (
                                    <div className="place-meta-item">
                                        <span className="place-meta-label">
                                            Identificador
                                        </span>
                                        <span className="place-meta-value">
                                            {place.id}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {place.description && (
                                <div className="place-details-info">
                                    <h2>Descrição do local</h2>
                                    <p>{place.description}</p>
                                </div>
                            )}

                            <div className="place-actions">
                                <button
                                    type="button"
                                    className="place-button-secondary"
                                    onClick={() => navigate("/places")}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
