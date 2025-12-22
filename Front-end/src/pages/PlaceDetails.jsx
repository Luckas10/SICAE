import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import api from "../services/api";
import Swal from "sweetalert2";

import { useUser } from "../context/UserContext.jsx";

import "./Places.css";

export default function PlaceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loadingUser } = useUser();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchPlace() {
            try {
                const response = await api.get(`/places/${id}`);
                setPlace(response.data);
            } catch (err) {
                console.error("Erro ao buscar local:", err);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar local",
                    text: "Não foi possível carregar os detalhes deste local.",
                    customClass: { popup: "error-alert" },
                });
            } finally {
                setLoading(false);
            }
        }

        fetchPlace();
    }, [id]);

    const handleDelete = async () => {
        if (!loadingUser && user?.role !== "Servidor") {
            Swal.fire({
                icon: "warning",
                title: "Sem permissão",
                text: "Apenas Servidor pode excluir locais.",
            });
            return;
        }

        const confirm = await Swal.fire({
            icon: "warning",
            title: "Excluir local?",
            text: "Essa ação não pode ser desfeita.",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            setDeleting(true);

            await api.delete(`/places/${id}`);

            navigate("/places");

            await Swal.fire({
                icon: "success",
                title: "Local excluído!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: { popup: "success-alert" },
            });

        } catch (err) {
            console.error("Erro ao excluir local:", err);

            const msg =
                err?.response?.data?.detail ||
                "Não foi possível excluir o local. Tente novamente.";

            Swal.fire({
                icon: "error",
                title: "Erro ao excluir local",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: { popup: "error-alert" },
            });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <p className="place-details-loading">Carregando local...</p>;
    if (!place) return <p className="place-details-loading">Local não encontrado.</p>;

    const canManage = !loadingUser && user?.role === "Servidor";

    return (
        <>
            <Header />

            <main className="places-page">
                <Sidebar />

                <div className="places-content">
                    <div className="place-details-container">
                        <div className="place-details-card">
                            <div className="place-details-header">
                                <h2 className="place-details-title">{place.name}</h2>
                            </div>

                            <div className="place-details-body">
                                {place.image_path && (
                                    <img
                                        src={place.image_path}
                                        alt={place.name}
                                        className="place-details-image"
                                    />
                                )}

                                <div className="place-details-info">
                                    <h2>Capacidade</h2>
                                    <p>{place.capacity ?? "Não informada"}</p>
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
                                        className="event-button-secondary"
                                        onClick={() => navigate("/places")}
                                    >
                                        Voltar
                                    </button>

                                    {canManage && (
                                        <button
                                            type="button"
                                            className="event-button-secondary"
                                            onClick={() => navigate(`/places/edit/${id}`)}
                                        >
                                            Editar local
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="place-button-danger"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        title={deleting ? "Excluindo..." : "Excluir"}
                                    >
                                        {deleting ? "Excluindo..." : "Excluir"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
