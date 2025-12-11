import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import { useEffect, useState } from "react";
import api from "../services/api";

import SportsFilterBar from "../components/events/SportsFilterBar.jsx";
import EventCard from "../components/events/EventCard.jsx";
import { NavLink } from "react-router-dom";

import { useUser } from "../context/UserContext.jsx";

export default function Events() {
    const { user, loadingUser } = useUser();
    const [events, setEvents] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [showInitiation, setShowInitiation] = useState(false);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await api.get("/events");
                const raw = response.data;

                const list =
                    Array.isArray(raw)
                        ? raw
                        : Array.isArray(raw.data)
                            ? raw.data
                            : Array.isArray(raw.events)
                                ? raw.events
                                : [];

                setEvents(list);
            } catch (err) {
                console.error("Erro ao buscar eventos:", err);
                setEvents([]);
            }
        }

        fetchEvents();
    }, []);


    const filteredEvents = events
        .filter((ev) => {

            if (activeCategory !== "all" && ev.category !== activeCategory) {
                return false;
            }


            if (showInitiation && !ev.is_initiation) {
                return false;
            }

            return true;
        });

    return (
        <>
            <Header />
            <div className="events-page">
                <Sidebar />

                <div className="events-content">
                    <SportsFilterBar
                        activeCategory={activeCategory}
                        onChangeCategory={setActiveCategory}
                    />

                    <div className="events-toolbar">


                        <button
                            className={`initiation-filter-btn ${showInitiation ? "active" : ""}`}
                            onClick={() => setShowInitiation((prev) => !prev)}
                            id="buttonAdd"
                        >
                            Iniciação Esportiva
                        </button>

                        {!loadingUser && user?.role === "Servidor" && (
                            <NavLink to="/events/add" id="buttonAdd">
                                <button type="button" className="buttonAdd">+ Adicionar evento</button>
                            </NavLink>
                        )}
                    </div>

                    <div className="cards">
                        {filteredEvents.map((ev) => (
                            <EventCard key={ev.id} event={ev} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
