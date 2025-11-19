import { Navigate } from "react-router-dom";

export default function PublicRoute({ children, redirectTo = "/" }) {
    const token = localStorage.getItem("token");
    return token ? <Navigate to={redirectTo} replace /> : children;
}
