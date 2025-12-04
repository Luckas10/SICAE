import { CATEGORY_CONFIG, DEFAULT_CATEGORY } from "../../constants/eventCategories";
import news3 from '../../assets/news3.webp';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BottomCard({ newArticle }) {
    newArticle = { category: "futsal" };
    const cfg = CATEGORY_CONFIG[newArticle.category] || DEFAULT_CATEGORY;

    return (
        <div className="bottom-news-card">
            <div className="bottom-news-image">
                <img src={news3} alt="" />
            </div>

            <div className="bottom-news-content">
                <p className="sportsNewsId">
                    <FontAwesomeIcon
                        icon={cfg.icon}
                        className={cfg.className}
                    />{" "}
                    {cfg.label}
                </p>

                <h4>Pelézinho Soccer - Há 5 minutos.</h4>
                <p className="bottom-news-desc">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint incidunt architecto sequi doloremque?
                </p>
            </div>
        </div>
    );
}
