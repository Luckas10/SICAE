import './auth.css'

export default function Register() {
    return (
        <>
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>SICAE - Registrar-se</title>
            </head>
                <div class="main">
                <div class="auth register">
                    <form action="">
                    <input type="text" placeholder="Login"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Senha"/>
                    <input type="password" placeholder="Confirmar senha"/>
                    <a href="/login" class="form-link">Já tenho uma conta</a>
                    <button type="submit">Registrar-se</button>
                    </form>
                </div>
                </div>

                <div class="logo">
                    <div class="img"></div>
                </div>
        </>
        );
}