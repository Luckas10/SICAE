import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardCard({ image, typeIcon, typeLabel, text }) {
    return (
        <div className="card">
            <img src={image} alt={typeLabel} />
            <div className="cardText">
                <p id="cardType">
                    <FontAwesomeIcon icon={typeIcon} />
                    {typeLabel}
                </p>
                <p>{text}</p>
            </div>
        </div>
    );
}
