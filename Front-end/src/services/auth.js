import api from "./api";

export async function loginWithPassword({ email, password }) {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const { data } = await api.post("/auth/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return data;
}

export async function registerUser({ full_name, email, password }) {
    const { data } = await api.post("/users", {
        full_name,
        email,
        password,
        Role: "Aluno",
    });

    return data;
}
