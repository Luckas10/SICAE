import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;

        if (
            status === 401 &&
            !originalRequest?.url?.includes("/auth/token")
        ) {
            console.warn("Token expirou ou não foi enviado — deslogando...");

            localStorage.removeItem("token");

            if (window.location.pathname !== "/auth") {
                window.location.href = "/auth";
            }
        }

        return Promise.reject(error);
    }
);


export default api;
