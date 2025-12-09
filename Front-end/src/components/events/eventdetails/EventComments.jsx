import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Swal from "sweetalert2";
import "./EventComments.css";

import { NavLink } from "react-router-dom";

export default function EventsComments({ eventId, currentUser }) {
    const [comments, setComments] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const { refreshUser } = useUser();

    async function loadComments() {
        try {
            const { data } = await api.get(
                `/events-comments/event/${eventId}`
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
        if (eventId) {
            loadComments();
        }
    }, [eventId]);

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
            await api.post("/events-comments", {
                event_id: eventId,
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

        refreshUser();
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
            await api.put(`/events-comments/${commentId}`, null, {
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
            await api.delete(`/events-comments/${commentId}`);
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

        refreshUser();
    };

    if (loading) {
        return (
            <p className="event-comments-loading">
                Carregando comentários...
            </p>
        );
    }

    return (
        <div className="event-comments">
            <h2>Comentários</h2>

            <div className="event-comments-form">
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
                <p className="event-comments-empty">
                    Nenhum comentário ainda.
                </p>
            )}

            <div className="event-comments-list">
                {comments.map((comment) => {
                    const isOwner = currentUser?.id === comment.author_id;
                    const createdAt = new Date(
                        comment.created_at
                    ).toLocaleString("pt-BR");
                    const user = usersMap[comment.author_id];

                    return (
                        <div key={comment.id} className="event-comment-card">

                            <div className="event-comment-header">
                                <div className="event-comment-user">
                                    <NavLink to={`/profile/${user?.id}`}>
                                        <img
                                            src={
                                                user?.profile_image
                                                    ? user.profile_image
                                                    : "/img/profile.png"
                                            }
                                            alt="Foto do usuário"
                                            className="event-comment-avatar"
                                        />
                                    </NavLink>

                                    <div className="event-comment-user-info">
                                        <NavLink
                                            to={`/profile/${user?.id}`}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <strong>{user?.full_name || "Usuário"}</strong>
                                        </NavLink>
                                        <span>{createdAt}</span>
                                    </div>
                                </div>
                            </div>


                            {editingId === comment.id ? (
                                <div className="event-comment-edit">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                    />

                                    <div className="event-comment-actions">
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
                                <p className="event-comment-content">
                                    {comment.content}
                                </p>
                            )}

                            {isOwner && editingId !== comment.id && (
                                <div className="event-comment-menu">
                                    <button
                                        className="event-comment-menu-btn"
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
                                        <div className="event-comment-dropdown">
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
