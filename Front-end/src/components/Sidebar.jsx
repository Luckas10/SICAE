import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: "Deseja sair?",
            text: "Você será desconectado da sua conta.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, sair",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
            localStorage.removeItem("token");
            await Swal.fire({
                icon: "success",
                title: "Sessão encerrada",
                text: "Você saiu da conta com sucesso.",
                timer: 1800,
                showConfirmButton: false,
            });
            navigate("/login");
        }
    };

    return (
        <aside className="sidebar">
            <button className="logout-btn" onClick={handleLogout}>
                Sair
            </button>
        </aside>
    );
}
