import { useEffect, useState } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import "./NewsComments.css";

export default function NewsComments({ articleId, currentUser }) {
    const [comments, setComments] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    async function loadComments() {
        try {
            const { data } = await api.get(
                `/news-comments/article/${articleId}`
            );

            const ordered = data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setComments(ordered);
            await loadUsers(ordered);
        } catch (err) {
            console.error("Erro ao carregar comentários:", err);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar os comentários.",
                icon: "error",
                customClass: { popup: "comment-alert" },
            });
        } finally {
            setLoading(false);
        }
    }

    async function loadUsers(commentsList) {
        try {
            const uniqueIds = [
                ...new Set(commentsList.map((c) => c.author_id)),
            ];

            const usersNotLoaded = uniqueIds.filter((id) => !usersMap[id]);

            if (usersNotLoaded.length === 0) return;

            const requests = usersNotLoaded.map((id) =>
                api.get(`/users/${id}`)
            );

            const responses = await Promise.all(requests);

            const newUsers = {};
            responses.forEach((res) => {
                newUsers[res.data.id] = res.data;
            });

            setUsersMap((prev) => ({ ...prev, ...newUsers }));
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar os autores dos comentários.",
                icon: "error",
                customClass: { popup: "comment-alert" },
            });
        }
    }

    useEffect(() => {
        if (articleId) {
            loadComments();
        }
    }, [articleId]);

    const handleCreate = async () => {
        if (!newComment.trim()) {
            Swal.fire({
                title: "Atenção",
                text: "Digite um comentário.",
                icon: "warning",
                customClass: { popup: "comment-alert" },
            });
            return;
        }

        try {
            setSubmitting(true);
            await api.post("/news-comments", {
                article_id: articleId,
                content: newComment,
            });

            setNewComment("");
            await loadComments();
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível enviar o comentário.",
                icon: "error",
                customClass: { popup: "comment-alert" },
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (commentId) => {
        if (!editContent.trim()) {
            Swal.fire({
                title: "Atenção",
                text: "O comentário não pode ficar vazio.",
                icon: "warning",
                customClass: { popup: "comment-alert" },
            });
            return;
        }

        try {
            await api.put(`/news-comments/${commentId}`, null, {
                params: { new_content: editContent },
            });

            setEditingId(null);
            setEditContent("");
            await loadComments();
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível editar o comentário.",
                icon: "error",
                customClass: { popup: "comment-alert" },
            });
        }
    };

    const handleDelete = async (commentId) => {
        const result = await Swal.fire({
            title: "Excluir comentário?",
            text: "Essa ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
            customClass: { popup: "comment-alert" },
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/news-comments/${commentId}`);
            await loadComments();
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível excluir o comentário.",
                icon: "error",
                customClass: { popup: "comment-alert" },
            });
        }
    };

    if (loading) {
        return (
            <p className="news-comments-loading">
                Carregando comentários...
            </p>
        );
    }

    return (
        <div className="news-comments">
            <h2>Comentários</h2>

            <div className="news-comments-form">
                <textarea
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <button onClick={handleCreate} disabled={submitting}>
                    {submitting ? "Enviando..." : "Comentar"}
                </button>
            </div>

            {comments.length === 0 && (
                <p className="news-comments-empty">
                    Nenhum comentário ainda.
                </p>
            )}

            <div className="news-comments-list">
                {comments.map((comment) => {
                    const isOwner = currentUser?.id === comment.author_id;
                    const createdAt = new Date(
                        comment.created_at
                    ).toLocaleString("pt-BR");
                    const user = usersMap[comment.author_id];

                    return (
                        <div key={comment.id} className="news-comment-card">
                            <div className="news-comment-header">
                                <strong>
                                    {user?.full_name || "Usuário"}
                                </strong>
                                <span>{createdAt}</span>
                            </div>

                            {editingId === comment.id ? (
                                <div className="news-comment-edit">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                    />

                                    <div className="news-comment-actions">
                                        <button
                                            onClick={() =>
                                                handleUpdate(comment.id)
                                            }
                                        >
                                            Salvar
                                        </button>

                                        <button
                                            className="cancel"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditContent("");
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="news-comment-content">
                                    {comment.content}
                                </p>
                            )}

                            {isOwner && editingId !== comment.id && (
                                <div className="news-comment-menu">
                                    <button
                                        className="news-comment-menu-btn"
                                        onClick={() =>
                                            setOpenMenuId(
                                                openMenuId === comment.id
                                                    ? null
                                                    : comment.id
                                            )
                                        }
                                    >
                                        ⋮
                                    </button>

                                    {openMenuId === comment.id && (
                                        <div className="news-comment-dropdown">
                                            <button
                                                onClick={() => {
                                                    setEditingId(comment.id);
                                                    setEditContent(
                                                        comment.content
                                                    );
                                                    setOpenMenuId(null);
                                                }}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="danger"
                                                onClick={() => {
                                                    handleDelete(comment.id);
                                                    setOpenMenuId(null);
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
