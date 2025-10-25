// SidebarLink.jsx
import { Link } from "react-router-dom";

/**
 * Um componente reutilizável para links/botões da sidebar.
 * - Se tiver `to`, ele navega usando <Link> (React Router)
 * - Se tiver `onClick`, vira um botão comum
 * 
 * Props:
 * - icon: componente SVG importado
 * - label: texto do botão
 * - to: rota (opcional)
 * - onClick: função a executar (opcional)
 */

export default function SidebarLink({ icon: Icon, label, to, onClick }) {
    if (to && !onClick) {
        return (
            <Link to={to} className="side-link">
                <Icon className="img" />
                <span>{label}</span>
            </Link>
        );
    }

    return (
        <button className="side-link" onClick={onClick}>
            <Icon className="img" />
            <span>{label}</span>
        </button>
    );
}
