import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import SettingsHeader from "../components/settings/SettingsHeader.jsx";
import ThemeCard from "../components/settings/ThemeCard.jsx";
import Swal from "sweetalert2"

import "./Settings.css";

import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";


export default function Settings() {
    const { theme, toggleTheme } = useUser();
    const isNight = theme === "dark";

    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Deseja sair da conta?",
            text: "Você será desconectado deste dispositivo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, sair",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            // limpa o token do usuário
            localStorage.removeItem("token");

            // redireciona para a tela de login
            navigate("/auth");
        }
    };

    return (
        <>
            <Header />
            <div className="settings-page">
                <Sidebar />

                <div className="settings-content">
                    <SettingsHeader />

                    <ThemeCard
                        isNight={isNight}
                        toggleTheme={toggleTheme}
                    />

                    <div className="settings-card logout-card">
                        <div className="logout-text">
                            <h2>Sair da conta</h2>
                            <p>
                                Encerre sua sessão com segurança neste dispositivo.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <FontAwesomeIcon size="lg" icon={fas.faRightFromBracket} />
                            <span>Sair</span>
                        </button>


                    </div>
                </div>
            </div>
        </>
    );
}
