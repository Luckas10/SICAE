import { NavLink } from "react-router-dom";
import newsFallback from "../../assets/news1.jpg";

export default function PlaceCard({ place, createdAtLabel }) {
    return (
        <NavLink
            to={`/places/${place.id}`}
            className="place-card"
        >
            <img
                src={place.image_path || newsFallback}
                alt={place.name}
            />

            <h5>{place.name}</h5>

            {place.capacity > 0 && (
                <p className="place-capacity">
                    Capacidade: {place.capacity} pessoas
                </p>
            )}

            {place.description && (
                <p className="place-description">
                    {place.description}
                </p>
            )}
        </NavLink>
    );
}
