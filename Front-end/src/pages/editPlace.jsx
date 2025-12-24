import "./Places.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Swal from "sweetalert2";
import CoverField from "../components/general/CoverField.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function EditPlace() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loadingUser } = useUser();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [capacity, setCapacity] = useState("");
    const [imagePath, setImagePath] = useState(null);

    // Carregar local
    useEffect(() => {
        async function loadPlace() {
            try {
                const { data } = await api.get(`/places/${id}`);
                setName(data?.name || "");
                setDescription(data?.description || "");
                setCapacity(
                    data?.capacity !== undefined && data?.capacity !== null
                        ? String(data.capacity)
                        : ""
                );
                setImagePath(data?.image_path || null);
            } catch (err) {
                console.error("Erro ao carregar local:", err);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar local",
                    text: "Não foi possível carregar este local para edição.",
                    customClass: { popup: "error-alert" },
                });
                navigate("/places");
            } finally {
                setLoading(false);
            }
        }

        loadPlace();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Bloqueio por permissão (mesma lógica do seu Places.jsx)
        if (!loadingUser && user?.role !== "Servidor") {
            Swal.fire({
                icon: "warning",
                title: "Sem permissão",
                text: "Apenas Servidor pode editar locais.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        if (!name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nome obrigatório",
                text: "Informe um nome para o local.",
                customClass: { popup: "logout-alert" },
            });
            return;
        }

        const capacityNum = capacity ? Number(capacity) : 0;
        if (capacity && Number.isNaN(capacityNum)) {
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
                name: name.trim(),
                description: description?.trim() || "",
                capacity: capacityNum,
                image_path: imagePath || null,
            };

            await api.put(`/places/${id}`, payload);

            navigate(`/places/${id}`);
            
            await Swal.fire({
                icon: "success",
                title: "Local atualizado!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3200,
                timerProgressBar: true,
                customClass: { popup: "success-alert" },
            });


        } catch (err) {
            console.error("Erro ao atualizar local:", err);

            const msg =
                err?.response?.data?.detail ||
                "Não foi possível atualizar o local. Tente novamente.";

            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar local",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: { popup: "error-alert" },
            });
        }
    };

    if (loading) {
        return <p className="place-details-loading">Carregando local...</p>;
    }

    return (
        <>
            <Header />

            <main className="places-page">
                <Sidebar />

                <div className="places-content">
                    <div className="place-edit">
                        <h2 className="place-edit-title">Editar Local</h2>

                        <form className="place-edit-form" onSubmit={handleSubmit}>
                            <div className="place-input-row">
                                <label htmlFor="place-name">Nome do local</label>
                                <input
                                    id="place-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Quadra principal"
                                />
                            </div>

                            <div className="place-input-row">
                                <label htmlFor="place-description">Descrição</label>
                                <textarea
                                    id="place-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descrição do local (opcional)"
                                />
                            </div>

                            <div className="place-input-row">
                                <label htmlFor="place-capacity">Capacidade</label>
                                <input
                                    id="place-capacity"
                                    type="number"
                                    min="0"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    placeholder="Capacidade (opcional)"
                                />
                            </div>

                            <div className="place-input-row">
                                <CoverField
                                    value={imagePath}
                                    onChange={setImagePath}
                                    label="Imagem do local"
                                    inputId="place-edit-cover-input"
                                />
                            </div>

                            <div className="place-edit-actions">
                                <button
                                    type="button"
                                    className="place-button-secondary"
                                    onClick={() => navigate(`/places/${id}`)}
                                >
                                    Cancelar
                                </button>

                                <button type="submit" className="place-button-primary">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
