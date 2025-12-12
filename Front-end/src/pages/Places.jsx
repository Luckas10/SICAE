import "./Places.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";

import EventCoverField from "../components/events/addevent/EventCoverField.jsx";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext.jsx";

export default function Places() {
    const { user, loadingUser } = useUser();

    const [locals, setLocals] = useState([]);

    const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
    const [placeName, setPlaceName] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [placeCapacity, setPlaceCapacity] = useState("");
    const [placeImage, setPlaceImage] = useState(null);

    useEffect(() => {
        async function loadLocals() {
            try {
                const res = await api.get("/locals");
                setLocals(res.data || []);
            } catch (error) {
                console.error("Erro ao carregar locais:", error);
                setLocals([]);
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

            setLocals((prev) => [...prev, created]);
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

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <>
            <Header />

            <main className="places-page">
                <Sidebar />

                <div className="places-content">
                    <div className="places-toolbar">
                        <h2>Locais cadastrados</h2>

                        {!loadingUser && user?.role === "Servidor" && (
                            <button
                                type="button"
                                className="place-add-button"
                                onClick={handleOpenPlaceModal}
                            >
                                + Cadastrar novo local
                            </button>
                        )}
                    </div>

                    <div className="cards">
                        {locals.map((local) => (
                            <NavLink
                                to={`/places/${local.id}`}
                                key={local.id}
                                className="local-card-link"
                            >
                                <div className="local-card">
                                    {local.image_path && (
                                        <div className="local-card-cover">
                                            <img
                                                src={local.image_path}
                                                alt={`Imagem do local ${local.name}`}
                                            />
                                        </div>
                                    )}

                                    <div className="local-card-body">
                                        <h5>{local.name}</h5>

                                        {local.capacity > 0 && (
                                            <p className="local-capacity">
                                                Capacidade: {local.capacity} pessoas
                                            </p>
                                        )}

                                        {local.description && (
                                            <p className="local-description">
                                                {local.description}
                                            </p>
                                        )}

                                        <p className="local-created-at">
                                            Criado em: {formatDate(local.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </NavLink>
                        ))}

                        {locals.length === 0 && (
                            <p style={{ marginTop: "20px" }}>
                                Nenhum local cadastrado até o momento.
                            </p>
                        )}
                    </div>
                </div>
            </main>

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
                                <EventCoverField
                                    value={placeImage}
                                    onChange={setPlaceImage}
                                    label="Imagem do local"
                                    inputId="places-page-cover-input"
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
        </>
    );
}
