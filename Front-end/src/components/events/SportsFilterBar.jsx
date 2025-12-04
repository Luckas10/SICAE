import SportsFilterButton from "./SportsFilterButton";
import { CATEGORY_CONFIG } from "../../constants/eventCategories.js";

export default function SportsFilterBar({
    activeCategory,
    onChangeCategory,
}) {
    const handleFilterClick = (categoryKey) => {
        onChangeCategory((prev) =>
            prev === categoryKey ? "all" : categoryKey
        );
    };

    return (
        <div className="sports-content">

            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <SportsFilterButton
                    key={key}
                    label={cfg.label}
                    image={cfg.image}
                    className={cfg.className}
                    alt={cfg.label}
                    isActive={activeCategory === key}
                    onClick={() => handleFilterClick(key)}
                />

            ))}
        </div>
    );
}
