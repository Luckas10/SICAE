import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Background from "../components/Background";
import LoginRegisterContainer from "../components/LoginRegisterContainer";
import { loginWithPassword, registerUser } from "../services/auth";
import "../style.css";
import "./Swal.css";

export function LoginRegister() {
    const [isNight, setIsNight] = useState(false);
    const toggleTheme = () => setIsNight((v) => !v);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isNight ? "dark" : "light"
        );
    }, [isNight]);

    const imageSrc = isNight ? "/img/Background.jpg" : "/img/Background.jpg";

    const handleLogin = async ({ email, password }) => {
        try {
            const { access_token } = await loginWithPassword({ email, password });
            localStorage.setItem("token", access_token);

            navigate("/");

            Swal.fire({
                icon: "success",
                title: "Bem-vindo 👋",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3200,
                timerProgressBar: true,
                customClass: {
                    popup: "success-alert",
                },
                showClass: {
                    popup: "swal2-animate-toast-in",
                },
                hideClass: {
                    popup: "swal2-animate-toast-out",
                },
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível fazer login. Verifique suas credenciais.";

            await Swal.fire({
                icon: "error",
                title: "Falha no login",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
                customClass: {
                    popup: "error-alert",
                },
            });
        }
    };

    const handleRegister = async ({ full_name, email, password }) => {
        try {
            await registerUser({ username: full_name, email, password });

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
