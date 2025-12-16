import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import api from "../../services/api";
import { NavLink } from "react-router-dom";


export default function NotificationBell() {
    const [events, setEvents] = useState([]);
    const [places, setPlaces] = useState({});

    useEffect(() => {

        async function fetchUpcomingEvents() {
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

                const now = new Date();

                const upcomingEvents = list
                    .filter(e => e.end_date)
                    .filter(e => new Date(e.end_date) > now)
                    .sort(
                        (a, b) =>
                            new Date(a.end_date) - new Date(b.end_date)
                    )

                setEvents(upcomingEvents);

            } catch (err) {
                console.error("Erro ao buscar eventos:", err);
            }
        }

        fetchUpcomingEvents();
    }, []);

    useEffect(() => {
        async function fetchPlaces() {
            try {
                const uniquePlaceIds = [
                    ...new Set(events.map(e => e.place_id).filter(Boolean))
                ];

                const missingPlaceIds = uniquePlaceIds.filter(
                    id => !places[id]
                );

                if (missingPlaceIds.length === 0) return;

                const requests = missingPlaceIds.map(id =>
                    api.get(`/places/${id}`)
                );

                const responses = await Promise.all(requests);

                const newPlaces = {};
                responses.forEach(res => {
                    newPlaces[res.data.id] = res.data;
                });

                setPlaces(prev => ({ ...prev, ...newPlaces }));
            } catch (err) {
                console.error("Erro ao buscar locais:", err);
            }
        }

        if (events.length > 0) {
            fetchPlaces();
        }
    }, [events]);


    return (
        <div className="notifications">
            <div className="notifications-upper">
                <FontAwesomeIcon icon={faBell} className="bell-icon" />
            </div>

            <div className="notifications-list">
                {events.length === 0 && (
                    <p className="no-notifications">
                        Nenhum evento próximo
                    </p>
                )}

                {events.map(event => (
                    <NavLink to={`/events/${event.id}`} key={event.id} style={{ textDecoration: "none" }}>
                        <div className="notification-item">
                            <strong>{event.title}</strong>

                            <span className="event-time">
                                {new Date(event.start_date).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                {" — "}
                                {new Date(event.end_date).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>

                            <span className="event-place">
                                <FontAwesomeIcon icon={faLocationDot} />
                                {places[event.place_id]?.name || "Carregando local..."}
                            </span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
