import "./Atletas.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import test from "../assets/eventsIcons/event1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function Atletas() {

    return (
        <>
            <Header />
            <div className="atletas-page">
                <Sidebar />
                <div className="atletas-content">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={fas.faMagnifyingGlass} className="search-icon" />
                        <input
                            id="buscar"
                            type="text"
                            placeholder="Buscar atleta..."
                        />
                    </div>
                    <h1 className="title">Atletas</h1>
                    <div className="atletas-grid">
                        {Array.from({ length: 22 }).map((_, i) => (
                            <div className="atleta-card" key={i}>
                                <img src={test} alt="atleta" />
                                <p>Atleta</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
