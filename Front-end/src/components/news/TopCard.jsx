import { CATEGORY_CONFIG, NEWS_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NavLink } from "react-router-dom";

export default function TopCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || NEWS_CATEGORY;
    const dataFormatada = new Date(data.created_at).toLocaleDateString("pt-BR")

    return (
        <NavLink className="top-news-card" to={`/news/${data.id}`}>
            <img src={data.cover_image} alt="" />
            <div className="top-news-content">
                <h4>{data.title}</h4>
                <p>{data.add_info}</p>
            </div>
            <h6 className="top-news-date">{dataFormatada}</h6>
        </NavLink>
    );
}
