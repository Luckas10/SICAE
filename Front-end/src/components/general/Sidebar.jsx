import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Sidebar.css";
import "./Swal.css";

import { useUser } from "../../context/UserContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = async (event) => {
    event.preventDefault();

    const confirm = await Swal.fire({
      title: "Deseja sair?",
      text: "Você será desconectado da sua conta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "logout-alert",
      },
    });

    if (confirm.isConfirmed) {
      logout();

      await Swal.fire({
        icon: "success",
        title: "Sessão encerrada",
        text: "Você saiu da conta com sucesso.",
        timer: 1800,
        showConfirmButton: false,
        customClass: {
          popup: "success-alert",
        },
      });

      navigate("/auth");
    }
  };

  return (
    <nav className="sidebar">
      <ul className="sidebarLinks">
        <li>
          <NavLink to="/" end>
            <FontAwesomeIcon
              size="lg"
              icon={fas.faHouse}
              style={{ marginBottom: "2px" }}
            />
            <span>PÁGINA INICIAL</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/events">
            <FontAwesomeIcon
              size="lg"
              icon={fas.faCalendarWeek}
              style={{ marginBottom: "1px" }}
            />
            <span>EVENTOS</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/news">
            <FontAwesomeIcon
              size="lg"
              icon={fas.faNewspaper}
              style={{ marginBottom: "1px" }}
            />
            <span>NOTÍCIAS</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile">
            <FontAwesomeIcon
              size="lg"
              icon={fas.faAddressCard}
              style={{ marginBottom: "1px" }}
            />
            <span>SEU PERFIL</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/atletas">
            <FontAwesomeIcon size="lg" icon={fas.faMedal} />
            <span>ATLETAS</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings">
            <FontAwesomeIcon size="lg" icon={fas.faGear} />
            <span>CONFIGURAÇÕES</span>
          </NavLink>
        </li>
      </ul>

      <ul className="logout">
        <li>
          <NavLink to="/auth" onClick={handleLogout}>
            <FontAwesomeIcon size="lg" icon={fas.faRightFromBracket} />
            <span>SAIR</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
