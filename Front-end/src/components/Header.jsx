import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import headerLogo from "../assets/Logotipo-SICAE.png";
import "./Header.css";
import api from "../services/api";

export default function Header() {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchMe() {
            try {
                const { data } = await api.get("/users/me");
                // sua API retorna { id, full_name }
                if (isMounted) setUserName(data.full_name || "Usuário");
            } catch (err) {
                // Sem token ou token inválido
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            }
        }

        fetchMe();
        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return (
        <header className="header">
            <div className="header-logo">
                <img src={headerLogo} alt="SICAE" />
            </div>

            <div className="user-info">
                <p>{userName || "Carregando..."}</p>
                <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt="avatar"
                />
            </div>
        </header>
    );
}
