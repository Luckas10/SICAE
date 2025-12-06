import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import Swal from "sweetalert2";

export default function useNewsDetails(id) {
    const navigate = useNavigate();

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get(`/news/${id}`);
                setNews(data);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao carregar notícia",
                });
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function handleDelete() {
        const confirm = await Swal.fire({
            title: "Excluir notícia?",
            text: "Essa ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
        });

        if (!confirm.isConfirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/news/${id}`);

            await Swal.fire({
                icon: "success",
                title: "Notícia excluída",
            });

            navigate("/news");
        } finally {
            setDeleting(false);
        }
    }

    const formattedDate =
        news?.created_at
            ? new Date(news.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
              })
            : "";

    function navigateBack() {
        navigate("/news");
    }

    return {
        news,
        loading,
        deleting,
        formattedDate,
        handleDelete,
        navigateBack,
    };
}
