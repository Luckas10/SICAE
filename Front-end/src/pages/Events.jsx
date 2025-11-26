import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import event1 from "../assets/eventsIcons/event1.png";
import news1 from "../assets/news1.jpg";
import { NavLink } from "react-router-dom";

import { fas } from "@fortawesome/free-solid-svg-icons";

import SportsStrip from "../components/events/SportsStrip.jsx";
import EventCard from "../components/events/EventCard.jsx";

export default function Events() {
    const sportsIcons = [event1, event1, event1, event1, event1, event1];

    const eventsData = [
        {
            image: news1,
            icon: fas.faFutbol,
            iconClassName: "futsalIcon",
            label: "FUTSAL",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faBasketball,
            iconClassName: "basketballIcon",
            label: "BASQUETE",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faTableTennis,
            iconClassName: "tabletennisIcon",
            label: "TÊNIS DE MESA",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faHandBackFist,
            iconClassName: "fightingIcon",
            label: "LUTAS",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faPersonRunning,
            iconClassName: "athleticsIcon",
            label: "ATLETISMO",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faVolleyball,
            iconClassName: "volleyballIcon",
            label: "VOLEIBOL",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faWater,
            iconClassName: "swimmingIcon",
            label: "NATAÇÃO",
            title: "Pelézin amassando no fut",
        },
        {
            image: news1,
            icon: fas.faGamepad,
            iconClassName: "esportsIcon",
            label: "E-SPORTS",
            title: "Pelézin amassando no fut",
        },
    ];

    return (
        <>
            <Header />
            <div className="events-page">
                <Sidebar />
                <div className="events-content">
                    <SportsStrip icons={sportsIcons} />

                    <NavLink to="./add" id="buttonAdd">
                        <button>+ Adicionar evento</button>
                    </NavLink>

                    <div className="cards">
                        {eventsData.map((event) => (
                            <EventCard
                                key={event.id}
                                image={event.image}
                                icon={event.icon}
                                iconClassName={event.iconClassName}
                                label={event.label}
                                title={event.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
