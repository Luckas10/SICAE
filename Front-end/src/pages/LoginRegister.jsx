import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Background from "../components/auth/Background";
import LoginRegisterContainer from "../components/auth/LoginRegisterContainer";
import { loginWithPassword, registerUser } from "../services/auth";
import "../style.css";
import "../components/general/Swal.css";

import { useUser } from "../context/UserContext";

export function LoginRegister() {
    const navigate = useNavigate();
    const { theme, toggleTheme, refreshUser } = useUser();

    const isNight = theme === "dark";

    const imageSrc = "/img/Background.jpg";

    const handleLogin = async ({ email, password }) => {
        try {
            const { access_token } = await loginWithPassword({ email, password });

            localStorage.setItem("token", access_token);

            await refreshUser();

            navigate("/");

            Swal.fire({
                icon: "success",
                title: "Bem-vindo!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3200,
                timerProgressBar: true,
                customClass: {
                    popup: "success-alert",
                },
            });
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível entrar. Verifique suas credenciais.";

            await Swal.fire({
                icon: "error",
                title: "Erro ao entrar",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: {
                    popup: "error-alert",
                },
            });
        }
    };

    const handleRegister = async ({ full_name, email, password }) => {
        try {
            await registerUser({ full_name, email, password });

            await Swal.fire({
                icon: "success",
                title: "Conta criada!",
                text: "Você já pode entrar com seu e-mail e senha.",
                confirmButtonText: "Beleza",
                customClass: {
                    popup: "success-alert",
                },
            });

            navigate("/auth");
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível criar a conta. Tente novamente.";

            await Swal.fire({
                icon: "error",
                title: "Erro ao registrar",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: {
                    popup: "error-alert",
                },
            });
        }
    };

    return (
        <Background as="main" src={imageSrc} blur={2} dark={isNight ? 0.15 : 0}>
            <LoginRegisterContainer
                isNight={isNight}
                onToggleTheme={toggleTheme}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        </Background>
    );
}
