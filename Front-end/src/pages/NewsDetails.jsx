import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import api from "../services/api";
import Swal from "sweetalert2";
import "./News.css";

export default function NewsDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchNews() {
            try {
                const { data } = await api.get(`/news/${id}`);
                setNews(data);
            } catch (err) {
                console.error("Erro ao buscar notícia:", err);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar notícia",
                    text: "Não foi possível carregar os detalhes desta notícia.",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, [id]);

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Excluir notícia?",
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
            await api.delete(`/news/${id}`);

            await Swal.fire({
                icon: "success",
                title: "Notícia excluída",
                text: "A notícia foi excluída com sucesso.",
                customClass: {
                    popup: "success-alert"
                }
            });

            navigate("/news");
        } catch (err) {
            console.error("Erro ao excluir notícia:", err);

            Swal.fire({
                icon: "error",
                title: "Erro ao excluir",
                text: "Não foi possível excluir a notícia.",
                customClass: {
                    popup: "error-alert"
                }
            });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <p className="news-details-loading">Carregando notícia...</p>;
    }

    if (!news) {
        return <p className="news-details-loading">Notícia não encontrada.</p>;
    }

    let formattedDate = "";
    if (news.created_at) {
        const date = new Date(news.created_at);
        formattedDate = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <>
            <Header />

            <div className="news-page">
                <Sidebar />

                <div className="news-content">
                    <div className="news-details">
                        <div className="news-details-header">
                            <h1>{news.title}</h1>
                            <h3>{news.add_info}</h3>
                            <p className="news-details-subtitle">
                                Publicado por {news.creator_name} • {formattedDate}
                            </p>
                        </div>

                        {news.cover_image && (
                            <div className="news-details-cover">
                                <img src={news.cover_image} alt={news.title} />
                            </div>
                        )}

                        <div className="news-details-body">
                            <div className="news-details-info">
                                <p>
                                    {news.content && news.content.trim().length > 0
                                        ? news.content
                                        : "Nenhum conteúdo foi cadastrado para esta notícia."}
                                </p>
                            </div>

                            <div className="news-actions">
                                <button
                                    type="button"
                                    className="news-button-secondary"
                                    onClick={() => navigate("/news")}
                                >
                                    Voltar para notícias
                                </button>

                                <button
                                    type="button"
                                    className="news-button-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? "Excluindo..." : "Excluir notícia"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
