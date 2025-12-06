
export default function ThemeStatus({ isNight }) {
    return (
        <span className="theme-status">
            Tema atual: <strong>{isNight ? "Modo escuro" : "Modo claro"}</strong>
        </span>
    );
}
