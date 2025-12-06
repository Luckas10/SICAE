import ButtonDarkMode from "../auth/ButtonDarkMode.jsx";
import ThemeStatus from "./ThemeStatus.jsx";

export default function ThemeCard({ isNight, toggleTheme }) {
    return (
        <section className="settings-card theme-card">
            <div className="theme-text">
                <h2>Tema do sistema</h2>
                <p>
                    Altere entre modo claro e escuro. Essa opção
                    afeta apenas a aparência visual da aplicação.
                </p>

                <ThemeStatus isNight={isNight} />
            </div>

            <div className="theme-switch-wrapper">
                <ButtonDarkMode
                    checked={isNight}
                    onChange={toggleTheme}
                    size={20}
                />
            </div>
        </section>
    );
}
