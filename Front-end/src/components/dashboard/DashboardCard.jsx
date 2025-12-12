import { CATEGORY_CONFIG, NEWS_CATEGORY } from "../../constants/eventCategories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export default function DashboardCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || NEWS_CATEGORY;

    const dataFormatada =
        data.created_at
            ? new Date(data.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "";

    return (
        <NavLink className="dashboard-card" to={`/${data.isEvent ? "events" : "news"}/${data.id}`}>
            <img src={data.cover_image} alt="" />

            <div className="dashboard-card-sub">
                <p className="sportsNewsId" style={{margin: "0"}}>
                    <FontAwesomeIcon icon={cfg.icon} className={cfg.className} />{" "}
                    {cfg.label}
                </p>

                <h6 className="dashboard-card-date">{dataFormatada}</h6>
            </div>

            <div className="dashboard-card-info">
                <h4>{data.title || data.name}</h4>
                <p>{data.add_info || data.description}</p>
            </div>
        </NavLink>
    );
}
