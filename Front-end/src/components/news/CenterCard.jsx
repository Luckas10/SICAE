import { CATEGORY_CONFIG, DEFAULT_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CenterCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || DEFAULT_CATEGORY;

    return(
        <div className="center-news-card">
            <img src={data.cover_image} alt="" />
            <p className="sportsNewsId">
                <FontAwesomeIcon
                    icon={cfg.icon}
                    className={cfg.className}
                />{" "}
                {cfg.label}
            </p>
            <div className="center-news-info">
                <h4>{data.title}</h4> 
                <p>{data.content}</p>
            </div>
        </div>
    )
}