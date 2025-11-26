import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Background from "../components/auth/Background";
import LoginRegisterContainer from "../components/auth/LoginRegisterContainer";
import { loginWithPassword, registerUser } from "../services/auth";
import "../style.css";
import "../components/general/Swal.css";

export function LoginRegister() {
    const [isNight, setIsNight] = useState(false);
    const navigate = useNavigate();

    const toggleTheme = () => setIsNight((v) => !v);

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isNight ? "dark" : "light"
        );
    }, [isNight]);

    const imageSrc = "/img/Background.jpg";

    const handleLogin = async ({ email, password }) => {
        try {
            const { access_token } = await loginWithPassword({ email, password });

            localStorage.setItem("token", access_token);

            // 1) Navega primeiro
            navigate("/");

            // 2) Dispara o toast sem "await"
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
