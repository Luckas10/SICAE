import "./Dashboard.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import { useEffect, useState } from "react";
import api from "../services/api.js";

import HighlightCarousel from "../components/dashboard/HighlightCarousel.jsx";
import NotificationBell from "../components/dashboard/NotificationBell.jsx";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";

export default function Dashboard() {
    const [topNews, setTopNews] = useState([]);
    const [topEvents, setTopEvents] = useState([]);

    useEffect(() => {
        async function fetchTopNews() {
            try {
                const response = await api.get("/news");
                const raw = response.data;

                const list =
                    Array.isArray(raw)
                        ? raw
                        : Array.isArray(raw.data)
                            ? raw.data
                            : Array.isArray(raw.news)
                                ? raw.news
                                : [];

                const top = list
                    .filter(n => n.priority === "top")
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);

                setTopNews(top);

            } catch (err) {
                console.error("Erro ao buscar notícias:", err);
            }
        }

        async function fetchTopEvents() {
            try {
                const response = await api.get("/events");
                const raw = response.data;

                const events =
                    Array.isArray(raw)
                        ? raw
                        : Array.isArray(raw.data)
                            ? raw.data
                            : Array.isArray(raw.events)
                                ? raw.events
                                : [];

                const latestEvents = events
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);

                setTopEvents(latestEvents);

            } catch (err) {
                console.error("Erro ao buscar eventos:", err);
            }
        }

        fetchTopNews();
        fetchTopEvents();
    }, []);

    const newsSlides = topNews.map((news) => ({
        id: news.id,
        image: news.cover_image,
        alt: news.title,
        title: news.title,
        description: news.text || news.subtitle || "",
        date: news.created_at
            ? new Date(news.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "",
    }));

    const dashboardCards = [
        ...topNews.map(n => ({ ...n, isEvent: false })),
        ...topEvents.map(e => ({ ...e, isEvent: true }))
    ];

    return (
        <>
            <Header />
            <main className="dashboard-page">
                <Sidebar />
                <div className="dashboard-content">
                    <div className="main-content">
                        <HighlightCarousel slides={newsSlides} />
                        <NotificationBell />
                    </div>

                    <div className="cards">
                        {dashboardCards.map((item) => (
                            <DashboardCard key={item.id} data={item} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
