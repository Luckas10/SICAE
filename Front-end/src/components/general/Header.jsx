import { useEffect, useState } from "react";
import headerLogo from '../../assets/Logotipo-SICAE.png';
import './Header.css';
import api from '../../services/api.js';

export default function Header() {

    const [username, setUsername] = useState("");

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await api.get('/users/me');
                setUsername(response.data.full_name);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        }

        fetchUser();
    }, []);

    return (
        <header className="header">
            <div className="header-logo">
                <img src={headerLogo} alt="SICAE" />
            </div>
            <div className="user-info">
                <p>{username || "Carregando..."}</p>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" />
            </div>
        </header>
    )
};