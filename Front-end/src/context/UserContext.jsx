import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [errorUser, setErrorUser] = useState(null);

    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoadingUser(false);
            return;
        }

        try {
            setLoadingUser(true);
            setErrorUser(null);

            const { data } = await api.get("/users/me");
            setUser(data);

            if (data.theme) {
                setTheme(data.theme);
                localStorage.setItem("theme", data.theme);
            } else {
                setTheme("light");
                localStorage.setItem("theme", "light");
            }
        } catch (err) {
            console.error("Erro ao carregar usuário atual:", err);
            setErrorUser(err);
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const updateAvatar = (profile_image) => {
        setUser((prev) =>
            prev ? { ...prev, profile_image } : { profile_image }
        );
    };

    const updateName = (full_name) => {
        setUser((prev) =>
            prev ? { ...prev, full_name } : { full_name }
        );
    };

    const updateEmail = (email) => {
        setUser((prev) =>
            prev ? { ...prev, email } : { email }
        );
    };

    const updateTheme = async (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        try {
            await api.put("/users/me/theme", { theme: newTheme });
            setUser((prev) =>
                prev ? { ...prev, theme: newTheme } : prev
            );
        } catch (err) {
            console.error("Erro ao atualizar tema do usuário:", err);
        }
    };

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        updateTheme(next);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("theme");
        setUser(null);
        setTheme("light");
        document.documentElement.setAttribute("data-theme", "light");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loadingUser,
                errorUser,
                refreshUser: fetchCurrentUser,
                updateAvatar,
                updateName,
                updateEmail,
                theme,
                updateTheme,
                toggleTheme,
                logout,
                setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser deve ser usado dentro de <UserProvider>");
    }
    return ctx;
}
