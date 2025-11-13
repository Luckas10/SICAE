import { useState, useEffect } from "react";
import Background from "../components/Background.jsx";
import LoginRegisterContainer from "../components/LoginRegisterContainer.jsx";
import "./LoginRegister.css";

export function LoginRegister() {
    const [isNight, setIsNight] = useState(false);
    const toggleTheme = () => setIsNight(v => !v);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", isNight ? "dark" : "light");
    }, [isNight]);

    const imageSrc = isNight
        ? "/img/Background.jpg"
        : "/img/Background.jpg";

    return (
        <Background
            as="main"
            src={imageSrc}
            blur={2}
            dark={isNight ? 0.15 : 0}
        >
            <LoginRegisterContainer
                isNight={isNight}
                onToggleTheme={toggleTheme}
            />
        </Background>
    );
}
