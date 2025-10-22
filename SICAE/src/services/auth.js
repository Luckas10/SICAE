// src/services/auth.js
import api from "./api";

// FastAPI com OAuth2PasswordRequestForm espera "username" (vamos enviar o e-mail nele)
export async function loginWithPassword({ email, password }) {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    // Se seu auth estiver em /auth/token (pelo OAuth2PasswordBearer)
    const { data } = await api.post("/auth/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    // espera { access_token, token_type }
    return data;
}

export async function registerUser({ full_name, email, password }) {
    const { data } = await api.post("/users", {
        full_name,
        email,
        password,
    });
    return data;
}
