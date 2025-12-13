import "./Home.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import { useEffect, useState } from "react";
import api from "../services/api.js";

import HighlightCarousel from "../components/home/HighlightCarousel.jsx";
import NotificationBell from "../components/home/NotificationBell.jsx";
import HomeCard from "../components/home/HomeCard.jsx";

export default function Home() {
    const [allNews, setAllNews] = useState([]);
    const [topNews, setTopNews] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        async function fetchNews() {
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

                setAllNews(list);

                const tops = list
                    .filter(n => n.priority === "top")
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 6);

                setTopNews(tops);

            } catch (err) {
                console.error("Erro ao buscar notícias:", err);
            }
        }

        async function fetchEvents() {
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

                setAllEvents(events);

            } catch (err) {
                console.error("Erro ao buscar eventos:", err);
            }
        }

        fetchNews();
        fetchEvents();
    }, []);

    const newsSlides = topNews.map(news => ({
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

    const homeCards = [
        ...allNews
            .filter(n => n.priority !== "top")
            .map(n => ({ ...n, isEvent: false }))
            .slice(0, 9),

        ...allEvents
            .map(e => ({ ...e, isEvent: true }))
            .slice(0, 9)
    ];

    return (
        <>
            <Header />
            <main className="home-page">
                <Sidebar />
                <div className="home-content">
                    <div className="main-content">
                        <HighlightCarousel slides={newsSlides} />
                        <NotificationBell />
                    </div>

                    <div className="cards">
                        {homeCards.map((item) => (
                            <HomeCard key={item.id} data={item} />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
