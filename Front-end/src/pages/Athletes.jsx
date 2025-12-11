import "./Athletes.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import api from "../services/api.js";

import { NavLink } from "react-router-dom";

import { useUser } from "../context/UserContext.jsx";

export default function Athletes() {
    const { user, loadingUser } = useUser();
    const [athletes, setAthletes] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get("/users/public")
            .then((res) => {
                const apenasAtletas = res.data.filter(
                    (user) => user.role === "Atleta"
                );
                setAthletes(apenasAtletas);
            })
            .catch((err) => {
                console.error("Erro ao carregar atletas:", err);
            });
    }, []);

    const filteredAthletes = athletes.filter((atleta) =>
        atleta.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Header />
            <div className="athletes-page">
                <Sidebar />
                <div className="athletes-content">
                    <div className="search-bar">
                        <FontAwesomeIcon
                            icon={fas.faMagnifyingGlass}
                            className="search-icon"
                        />
                        <input
                            id="buscar"
                            type="text"
                            placeholder="Buscar atleta..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    {!loadingUser && user?.role === "Servidor" && (
                        <NavLink to="./manage" id="buttonAdd">
                            <button>+ Gerenciar atletas</button>
                        </NavLink>
                    )}
                    <h1 className="title">Atletas</h1>

                    <div className="athletes-grid">
                        {filteredAthletes.map((atleta) => (
                            <NavLink className="atleta-card" key={atleta.id} to={`/profile/${atleta.id}`}>
                                <img
                                    src={atleta.profile_image || "/img/profile.png"}
                                />
                                <p style={{ textAlign: "center" }}>{atleta.full_name}</p>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
