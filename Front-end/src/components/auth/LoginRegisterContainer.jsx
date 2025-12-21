import { useEffect, useRef } from "react";
import "./LoginRegisterContainer.css";
import ButtonDarkMode from "./ButtonDarkMode";

export default function LoginRegisterContainer({
    isNight,
    onToggleTheme,
    onLogin,
    onRegister,
    loginPrefill,
    forceLoginModeKey,
}) {
    const mainRef = useRef(null);
    const scopeRef = useRef(null);

    useEffect(() => {
        const root = scopeRef.current;
        const main = mainRef.current;

        const inputs = root.querySelectorAll(".input-field");
        const toggles = root.querySelectorAll(".toggle");
        const bullets = root.querySelectorAll(".bullets span");
        const images = root.querySelectorAll(".image");
        const textGrp = root.querySelector(".text-group");

        const onFocus = (e) => e.currentTarget.classList.add("active");
        const onBlur = (e) => {
            if (e.currentTarget.value !== "") return;
            e.currentTarget.classList.remove("active");
        };

        const onToggle = (e) => {
            e.preventDefault();
            main.classList.toggle("sign-up-mode");
        };

        const moveSlider = (e) => {
            const index = Number(e.currentTarget.dataset.value);

            const currentImage = root.querySelector(`.img-${index}`);
            if (currentImage) currentImage.classList.add("show");

            const texts = root.querySelectorAll(".text-item");

            texts.forEach((t) => t.classList.remove("active"));
            texts[index - 1]?.classList.add("active");


            bullets.forEach((b) => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
        };

        inputs.forEach((i) => {
            i.addEventListener("focus", onFocus);
            i.addEventListener("blur", onBlur);
        });
        toggles.forEach((t) => t.addEventListener("click", onToggle));
        bullets.forEach((b) => b.addEventListener("click", moveSlider));

        return () => {
            inputs.forEach((i) => {
                i.removeEventListener("focus", onFocus);
                i.removeEventListener("blur", onBlur);
            });
            toggles.forEach((t) => t.removeEventListener("click", onToggle));
            bullets.forEach((b) => b.removeEventListener("click", moveSlider));
        };
    }, []);

    useEffect(() => {
        if (!mainRef.current || !scopeRef.current || !loginPrefill) return;

        const main = mainRef.current;
        const root = scopeRef.current;

        main.classList.remove("sign-up-mode");

        const loginForm = root.querySelector("form.sign-in-form");
        if (!loginForm) return;

        const matriculaInput = loginForm.querySelector('input[name="matricula"]');
        const passInput = loginForm.querySelector('input[name="password"]');

        if (matriculaInput) {
            matriculaInput.value = loginPrefill.matricula || "";
            if (loginPrefill.matricula) {
                matriculaInput.classList.add("active");
            }
        }

        if (passInput) {
            passInput.value = loginPrefill.password || "";
            if (loginPrefill.password) {
                passInput.classList.add("active");
            }
        }
    }, [loginPrefill, forceLoginModeKey]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const matricula = fd.get("matricula")?.toString().trim();
        const password = fd.get("password")?.toString();

        if (onLogin) await onLogin({ matricula, password });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const full_name = fd.get("full_name")?.toString().trim();
        const matricula = fd.get("matricula")?.toString().trim();
        const password = fd.get("password")?.toString();

        if (onRegister) await onRegister({ full_name, matricula, password });
    };

    return (
        <main ref={mainRef}>
            <div ref={scopeRef} className="box">
                <div className="inner-box">
                    <div className="forms-wrap">
                        <form autoComplete="off" className="sign-in-form" onSubmit={handleSignIn}>
                            <div className="logo">
                                <div className="brand">
                                    <img src="/img/LogoSVG.svg" alt="SICAE" />
                                    <h4>SICAE</h4>
                                </div>
                                <ButtonDarkMode checked={isNight} onChange={onToggleTheme} />
                            </div>

                            <div className="heading">
                                <h2>Bem vindo de volta!</h2>
                                <h6>Não tem uma conta?</h6>
                                <a href="#signup" className="toggle">Registrar-se</a>
                            </div>

                            <div className="actual-form">
                                <div className="input-wrap">
                                    <input
                                        name="matricula"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]+"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Matrícula</label>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        name="password"
                                        type="password"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Senha</label>
                                </div>

                                <input type="submit" value="Entrar" className="sign-btn" />

                                <p className="text">
                                    Esqueceu sua senha?
                                    <a href="#help">Chame ajuda</a> para recuperá-la.
                                </p>
                            </div>
                        </form>

                        <form autoComplete="off" className="sign-up-form" onSubmit={handleSignUp}>
                            <div className="logo">
                                <div className="brand">
                                    <img src="/img/LogoSVG.svg" alt="SICAE" />
                                    <h4>SICAE</h4>
                                </div>

                                <ButtonDarkMode checked={isNight} onChange={onToggleTheme} />
                            </div>

                            <div className="heading">
                                <h2>Vamos começar!</h2>
                                <h6>Já tem uma conta?</h6>
                                <a href="#signin" className="toggle">Entrar</a>
                            </div>

                            <div className="actual-form">
                                <div className="input-wrap">
                                    <input
                                        name="full_name"
                                        type="text"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Nome</label>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        name="matricula"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]+"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Matrícula</label>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        name="password"
                                        type="password"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Senha</label>
                                </div>

                                <input type="submit" value="Criar conta" className="sign-btn" />

                                <p className="text">
                                    Ao criar sua conta você concorda com os nossos
                                    <a href="#tos">Termos e serviços</a> e a nossa
                                    <a href="#privacy">Política de privacidade</a>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="carousel">
                        <div className="images-wrapper">
                            <img src="/img/LogoSVG.svg" className="image img-1 show" alt="" />
                        </div>

                        <div className="text-slider">
                            <div className="text-wrap">
                                <div className="text-group">
                                    <h2 className="text-item active">Fique por dentro dos esportes do IFRN!</h2>
                                    <h2 className="text-item">Participe, opine e divirta-se</h2>
                                    <h2 className="text-item">O que acontece no IFRN, você acompanha aqui</h2>
                                </div>
                            </div>

                            <div className="bullets">
                                <span className="active" data-value="1"></span>
                                <span data-value="2"></span>
                                <span data-value="3"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
