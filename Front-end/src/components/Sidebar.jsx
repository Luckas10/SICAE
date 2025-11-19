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
            <FontAwesomeIcon size="lg" icon={fas.faHouse} style={{ marginBottom: "2px"}} />
            <span>PÁGINA INICIAL</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/events">
            <FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} />
            <span>EVENTOS</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/news">
            <FontAwesomeIcon size="lg" icon={fas.faNewspaper} style={{ marginBottom: "1px"}} />
            <span>NOTÍCIAS</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/user">
            <FontAwesomeIcon size="lg" icon={fas.faAddressCard} style={{ marginBottom: "1px"}} />
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
            <FontAwesomeIcon size="lg" icon={fas.faRightFromBracket}  />
            <span>SAIR</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
