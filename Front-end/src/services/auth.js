import api from "./api";

export async function loginWithPassword({ matricula, password }) {
    const params = new URLSearchParams();
    params.append("username", String(matricula).trim());
    params.append("password", password);

    const { data } = await api.post("/auth/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return data;
}

export async function registerUser({ full_name, matricula, password }) {
    const { data } = await api.post("/users", {
        full_name,
        matricula: Number(matricula),
        password,
        role: "Aluno",
    });

    return data;
}
