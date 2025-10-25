import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import SidebarLink from "./SidebarLink";

import Home from '../assets/icons/home-icon.svg?react'
import Events from '../assets/icons/events-icon.svg?react'
import Noticias from '../assets/icons/news-icon.svg?react'
import Usuarios from '../assets/icons/users-icon.svg?react'
import Configuracoes from '../assets/icons/config-icon.svg?react'
import Logout from '../assets/icons/logout-icon.svg?react'

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
            navigate("/auth");
        }
    };

    return (
        <aside className="sidebar">
            <div className="links">
                <SidebarLink icon={Home} label="Página Inicial" to="/home" />
                <SidebarLink icon={Events} label="Eventos" to="/events" />
                <SidebarLink icon={Noticias} label="Notícias" to="/news" />
                <SidebarLink icon={Usuarios} label="Usuários" to="/users" />
                <SidebarLink icon={Configuracoes} label="Configurações" to="/config" />
            </div>

            <div className="logout">
                <SidebarLink icon={Logout} label="Sair" onClick={handleLogout} />
            </div>
        </aside>
    );
}
