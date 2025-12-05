import { CATEGORY_CONFIG, DEFAULT_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NavLink } from "react-router-dom";

export default function TopCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || DEFAULT_CATEGORY;

    return (
        <NavLink className="top-news-card" to={`/news/${data.id}`}>
            <img src={data.cover_image} alt="" />
            <div className="top-news-content">
                <h4>{data.title}</h4>
                <p>{data.add_info}</p>
            </div>
        </NavLink>
    );
}
