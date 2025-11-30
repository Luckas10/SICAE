import "./Settings.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import ButtonDarkMode from "../components/auth/ButtonDarkMode.jsx";
import { useUser } from "../context/UserContext";

export default function Settings() {
    const { theme, toggleTheme } = useUser();
    const isNight = theme === "dark";

    return (
        <>
            <Header />
            <div className="settings-page">
                <Sidebar />

                <div className="settings-content">
                    <header className="settings-header">
                        <h1>Configurações</h1>
                        <p>Personalize a sua experiência no SICAE.</p>
                    </header>

                    <section className="settings-card theme-card">
                        <div className="theme-text">
                            <h2>Tema do sistema</h2>
                            <p>
                                Altere entre modo claro e escuro. Essa opção
                                afeta apenas a aparência visual da aplicação.
                            </p>

                            <span className="theme-status">
                                Tema atual:{" "}
                                <strong>
                                    {isNight ? "Modo escuro" : "Modo claro"}
                                </strong>
                            </span>
                        </div>

                        <div className="theme-switch-wrapper">
                            <ButtonDarkMode
                                checked={isNight}
                                onChange={toggleTheme}
                                size={20}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
