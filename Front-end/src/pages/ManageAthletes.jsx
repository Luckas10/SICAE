import "./ManageAthletes.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ManageAthletes() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("todos");

    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleRole = async (user) => {
        const newRole = user.role === "Atleta" ? "Aluno" : "Atleta";

        try {
            await api.put(
                `/users/${user.id}?full_name=${user.full_name}&role=${newRole}`
            );

            Swal.fire({
                icon: "success",
                title: "Cargo atualizado!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });

            loadUsers();
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar cargo",
            });
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchName = user.full_name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchRole =
            roleFilter === "todos"
                ? true
                : roleFilter === "atleta"
                    ? user.role === "Atleta"
                    : user.role !== "Atleta";

        return matchName && matchRole;
    });


    return (
        <>
            <Header />

            <div className="addnews-page">
                <Sidebar />

                <div className="addNews-content">
                    <h2>Controle de Atletas</h2>

                    <label>Buscar aluno</label>
                    <div className="input-icon">
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        <input
                            type="text"
                            placeholder="Digite o nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-buttons">
                        <button className={roleFilter === "todos" ? "active" : ""}
                            onClick={() => setRoleFilter("todos")}>
                            Todos
                        </button>

                        <button className={roleFilter === "atleta" ? "active" : ""}
                            onClick={() => setRoleFilter("atleta")}>
                            Apenas Atletas
                        </button>

                        <button className={roleFilter === "aluno" ? "active" : ""}
                            onClick={() => setRoleFilter("aluno")}>
                            Apenas Alunos
                        </button>
                    </div>


                    <div className="users-list">
                        {filteredUsers.map((user) => (
                            <div className="user-card" key={user.id}>
                                <div className="user-left">
                                    <img
                                        src={user.profile_image || "/img/profile.png"}
                                        alt={user.full_name}
                                        className="user-avatar"
                                    />

                                    <span className="user-info">
                                        <strong>{user.full_name}</strong>
                                        <br />
                                        <small>{user.role}</small>
                                    </span>
                                </div>

                                <button
                                    className={`role-button ${user.role === "Atleta"
                                        ? "remove"
                                        : "add"
                                        }`}
                                    onClick={() => toggleRole(user)}
                                >
                                    <FontAwesomeIcon icon={faUserCheck} />
                                    {user.role === "Atleta"
                                        ? "Remover atleta"
                                        : "Tornar atleta"}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="news-form-buttons manage-buttons">
                        <button className="button-secondary"
                            type="button"
                            onClick={() => navigate("/athletes")}
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
