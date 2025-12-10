import { NavLink } from "react-router-dom";


export default function AddEventButton() {
    return (
        <NavLink to="/events/add" id="buttonAdd">
            <button type="button" className="buttonAdd">+ Adicionar evento</button>
        </NavLink>
    );
}
