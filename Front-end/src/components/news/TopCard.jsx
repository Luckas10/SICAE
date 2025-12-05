import { CATEGORY_CONFIG, DEFAULT_CATEGORY } from "../../constants/eventCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TopCard({ data }) {
    const cfg = CATEGORY_CONFIG[data.category] || DEFAULT_CATEGORY;

    return (
        <div className="top-news-card">
            <img src={data.cover_image} alt="" />
            <div className="top-news-content">
                <h4>{data.title}</h4>
                <p>{data.content}</p>
            </div>
        </div>
    );
}
