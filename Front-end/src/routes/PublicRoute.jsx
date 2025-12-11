import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function PublicRoute({ redirectTo = "/" }) {
  const { user, loadingUser } = useUser();

  if (loadingUser) return null;

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
