import { CATEGORY_CONFIG, NEWS_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../../constants/timeAgo";

import { NavLink } from "react-router-dom";

export default function BottomCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || NEWS_CATEGORY;

    return (
        <NavLink className="bottom-news-card" to={`/news/${data.id}`}>
            <div className="bottom-news-image">
                <img src={data.cover_image} alt="" />
            </div>

            <div className="bottom-news-content">
                <p className="sportsNewsId">
                    <FontAwesomeIcon
                        icon={cfg.icon}
                        className={cfg.className}
                    />{" "}
                    {cfg.label}
                </p>

                <h4>{data.title} — {timeAgo(data.created_at)}</h4>
                <p className="bottom-news-desc">
                    {data.add_info}
                </p>
            </div>
        </NavLink>
    );
}
