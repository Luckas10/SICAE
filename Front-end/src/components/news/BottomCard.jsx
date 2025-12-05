import { CATEGORY_CONFIG, DEFAULT_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../../constants/timeAgo";

export default function BottomCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || DEFAULT_CATEGORY;

    return (
        <div className="bottom-news-card">
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
                    {data.content}
                </p>
            </div>
        </div>
    );
}
