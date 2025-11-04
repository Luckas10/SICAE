import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <nav className="sidebar">

      <ul className="sidebarLinks">
        <li>
          <NavLink to="/" end>
            <FontAwesomeIcon size="lg" icon={fas.faHouse} />
            <span>PÁGINA INICIAL</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/events">
            <FontAwesomeIcon size="lg" icon={fas.faCalendarDays} />
            <span>EVENTOS</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/news">
            <FontAwesomeIcon size="lg" icon={fas.faNewspaper} />
            <span>NOTÍCIAS</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/user">
            <FontAwesomeIcon size="lg" icon={fas.faUser} />
            <span>USUÁRIO</span>
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
          <NavLink to="/logout">
            <FontAwesomeIcon size="lg" icon={fas.faRightFromBracket} />
            <span>SAIR</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
