import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Background from "../components/Background";
import LoginRegisterContainer from "../components/LoginRegisterContainer";
import { loginWithPassword, registerUser } from "../services/auth";
import "../style.css";

export function LoginRegister() {
    const [isNight, setIsNight] = useState(false);
    const toggleTheme = () => setIsNight((v) => !v);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", isNight ? "dark" : "light");
    }, [isNight]);

    const imageSrc = isNight ? "/img/Background.jpg" : "/img/Background.jpg";

    // ---- handlers que chamam a API + SweetAlert ----
    const handleLogin = async ({ email, password }) => {
        try {
            const { access_token } = await loginWithPassword({ email, password });
            localStorage.setItem("token", access_token);
            await Swal.fire({
                icon: "success",
                title: "Login realizado!",
                text: "Bem-vindo de volta 👋",
                confirmButtonText: "Continuar",
            });
            navigate("/events");
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível fazer login. Verifique suas credenciais.";
            await Swal.fire({
                icon: "error",
                title: "Falha no login",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
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
            });
            // opcional: automaticamente alternar para o formulário de login
            // ou navegar de volta para /login
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível criar a conta. Tente novamente.";
            await Swal.fire({
                icon: "error",
                title: "Erro ao registrar",
                text: Array.isArray(msg) ? msg.join("\n") : msg,
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