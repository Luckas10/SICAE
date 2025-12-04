import "./Events.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import { useEffect, useState } from "react";
import api from "../services/api";

import SportsFilterBar from "../components/events/SportsFilterBar.jsx";
import AddEventButton from "../components/events/AddEventButton.jsx";
import EventCard from "../components/events/EventCard.jsx";


export default function Events() {
    const [events, setEvents] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await api.get("/events");
                console.log("Resposta /events:", response.data);

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
                console.error("Erro ao buscar eventos da API:", err);
                setEvents([]);
            }
        }

        fetchEvents();
    }, []);

    const filteredEvents = Array.isArray(events)
        ? activeCategory === "all"
            ? events
            : events.filter((ev) => ev.category === activeCategory)
        : [];

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

                    <AddEventButton />

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

