import "./Dashboard.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";
import { useEffect, useState } from "react";
import api from "../services/api.js";

import { fas } from "@fortawesome/free-solid-svg-icons";

import card1 from "../assets/card1.jpg";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";

import HighlightCarousel from "../components/dashboard/HighlightCarousel.jsx";
import NotificationBell from "../components/dashboard/NotificationBell.jsx";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";

export default function Dashboard() {
    const [topNews, setTopNews] = useState([]);

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
                .slice(0, 5); // quantas notícias você quiser no carrossel

            setTopNews(top);

        } catch (err) {
            console.error("Erro ao buscar notícias:", err);
            setTopNews([]);
        }
    }

    fetchTopNews();
    }, []);

    const newsSlides = topNews.map(news => ({
        id: news.id,
        image: news.cover_image,   // coloque aqui o nome do campo da imagem
        alt: news.title,
        title: news.title,
        description: news.text || news.subtitle || "",
        date: new Date(news.created_at).toLocaleDateString("pt-BR"),
    }));


    const dashboardCards = [
        {
            image: card1,
            typeIcon: fas.faCalendarDays,
            typeLabel: "EVENTO",
            text: "Equipe de Vôlei do Campus Garante Vitória em Jogo Acirrado",
        },
        {
            image: card2,
            typeIcon: fas.faNewspaper,
            typeLabel: "NOTÍCIA",
            text: "Atletas do Badminton do IFRN se Destacam em Competição Regional",
        },
        {
            image: card3,
            typeIcon: fas.faCalendarDays,
            typeLabel: "EVENTO",
            text: "Treinador Ricardo Anuncia Novo Cursinho de Futsal para Iniciantes e Atletas em Formação",
        },
        {
            image: card1,
            typeIcon: fas.faCalendarDays,
            typeLabel: "EVENTO",
            text: "Equipe de Vôlei do Campus Garante Vitória em Jogo Acirrado",
        },
    ];

    return (
        <>
            <Header />
            <div className="dashboard-page">
                <Sidebar />
                <div className="dashboard-content">
                    <div className="main-content">
                        <HighlightCarousel slides={newsSlides} />
                        <NotificationBell />
                    </div>

                    <div className="cards">
                        {dashboardCards.map((card) => (
                            <DashboardCard
                                key={card.id}
                                image={card.image}
                                typeIcon={card.typeIcon}
                                typeLabel={card.typeLabel}
                                text={card.text}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
