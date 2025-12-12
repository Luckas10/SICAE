import { CATEGORY_CONFIG, NEWS_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NavLink } from "react-router-dom";

export default function CenterCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || NEWS_CATEGORY;
    const dataFormatada = new Date(data.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })

    return (
        <NavLink className="center-news-card" to={`/news/${data.id}`}>
            <img src={data.cover_image} alt="" />
            <div className="center-news-card-sub">
                <p className="sportsNewsId">
                    <FontAwesomeIcon
                        icon={cfg.icon}
                        className={cfg.className}
                    />{" "}
                    {cfg.label}
                </p>
                <h6 className="center-news-date">{dataFormatada}</h6>
            </div>

            <div className="center-news-info">
                <h4>{data.title}</h4>
                <p>{data.add_info}</p>
            </div>
        </NavLink>
    )
}