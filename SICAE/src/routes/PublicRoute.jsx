import { Navigate } from "react-router-dom";

export default function PublicRoute({ children, redirectTo = "/events" }) {
    const token = localStorage.getItem("token");
    return token ? <Navigate to={redirectTo} replace /> : children;
}
