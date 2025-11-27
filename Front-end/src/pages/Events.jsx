import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import event1 from "../assets/eventsIcons/event1.png";
import news1 from "../assets/news1.jpg";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

const CATEGORY_CONFIG = {
    futsal: {
        label: "FUTSAL",
        icon: fas.faFutbol,
        className: "futsalIcon",
    },
    basketball: {
        label: "BASQUETE",
        icon: fas.faBasketball,
        className: "basketballIcon",
    },
    tabletennis: {
        label: "TÊNIS DE MESA",
        icon: fas.faTableTennis,
        className: "tabletennisIcon",
    },
    fighting: {
        label: "LUTAS",
        icon: fas.faHandBackFist,
        className: "fightingIcon",
    },
    athletics: {
        label: "ATLETISMO",
        icon: fas.faPersonRunning,
        className: "athleticsIcon",
    },
    volleyball: {
        label: "VOLEIBOL",
        icon: fas.faVolleyball,
        className: "volleyballIcon",
    },
    swimming: {
        label: "NATAÇÃO",
        icon: fas.faWater,
        className: "swimmingIcon",
    },
    chess: {
        label: "XADREZ",
        icon: fas.faChess,
        className: "chessIcon",
    },
    esports: {
        label: "E-SPORTS",
        icon: fas.faGamepad,
        className: "esportsIcon",
    },
};

const DEFAULT_CATEGORY = {
    label: "EVENT",
    icon: fas.faCalendarDays,
    className: "athleticsIcon",
};

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const { data } = await api.get("/events");
                setEvents(data);
            } catch (err) {
                console.error("Erro ao buscar eventos da API:", err);
            }
        }

        fetchEvents();
    }, []);

    return (
        <>
            <Header />
            <div className="events-page">
                <Sidebar />
                <div className="events-content">
                    <div className="sports-content">
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                    </div>

                    <NavLink to="/events/add" id="buttonAdd">
                        <button>+ Adicionar evento</button>
                    </NavLink>

                    <div className="cards">
                        {events.map((ev) => {
                            const cfg = CATEGORY_CONFIG[ev.category] || DEFAULT_CATEGORY;

                            return (
                                <div className="event-card" key={ev.id}>
                                    <img
                                        src={ev.cover_image || news1}
                                        alt={ev.title}
                                    />
                                    <p className="sportsNewsId">
                                        <FontAwesomeIcon
                                            icon={cfg.icon}
                                            className={cfg.className}
                                        />{" "}
                                        {cfg.label}
                                    </p>
                                    <h5>{ev.title}</h5>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </>
    );
}
