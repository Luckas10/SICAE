import { CATEGORY_CONFIG, DEFAULT_CATEGORY } from "../../constants/eventCategories";
import news1 from '../../assets/news1.jpg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function CenterCard({ newArticle }) {
    newArticle = {category: "futsal"}
    const cfg = CATEGORY_CONFIG[newArticle.category] || DEFAULT_CATEGORY;

    return(
        <div className="center-news-card">
            <img src={news1} alt="" />
            <p className="sportsNewsId">
                <FontAwesomeIcon
                    icon={cfg.icon}
                    className={cfg.className}
                />{" "}
                {cfg.label}
            </p>
            <div className="center-news-info">
                <h4>Pelézinho Soccer</h4> 
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint incidunt architecto sequi doloremque? Itaque reprehenderit quo dolorum! Cupiditate fuga provident hic iste! Distinctio alias nemo facere, adipisci quaerat itaque modi!</p>
            </div>
        </div>
    )
}