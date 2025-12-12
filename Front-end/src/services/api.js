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
        const url = originalRequest?.url || "";

        /** ✅ ROTAS PÚBLICAS REAIS */
        const publicPaths = [
            "/news",
            "/events",
            "/athletes",
            "/places",
            "/news-comments",
            "/games/event",
            "/events",
            "/users/public"
        ];

        const isPublicRequest = publicPaths.some((path) =>
            url.startsWith(path)
        );

        if (status === 401 && isPublicRequest) {
            return Promise.reject(error);
        }

        if (status === 401) {
            console.warn("Token inválido — redirecionando...");
            localStorage.removeItem("token");

            if (window.location.pathname !== "/auth") {
                window.location.href = "/auth";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
