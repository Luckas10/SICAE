import "./Dashboard.css";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { fas } from "@fortawesome/free-solid-svg-icons";

import img1 from "../assets/carousel/imagem1.png";
import img2 from "../assets/carousel/imagem2.jpeg";
import img3 from "../assets/carousel/imagem3.jpg";
import card1 from "../assets/card1.jpg";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";

import HighlightCarousel from "../components/dashboard/HighlightCarousel.jsx";
import NotificationBell from "../components/dashboard/NotificationBell.jsx";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";

export default function Dashboard() {
    const carouselSlides = [
        {
            image: img1,
            alt: "Primeiro slide",
            title: "IF BRILHA NO INTERCAMPI",
            description: "ATLETAS DO SICAE BRILHARAM ESTA NOITE, FAZENDO UM ESPETÁCULO EM SEUS RESPECTIVOS ESPORTES",
            date: "17 DE NOVEMBRO DE 2025",
        },
        {
            image: img2,
            alt: "Segundo slide",
            title: "CIRILO",
            description: "MENINO DO CARROSSEL",
            date: "18 DE NOVEMBRO DE 2025",
        },
        {
            image: img3,
            alt: "Terceiro slide",
            title: "ESPORTES",
            description: "OLHA AQUI OS ESPORTES",
            date: "17 DE NOVEMBRO DE 2025",
        },
    ];

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
                        <HighlightCarousel slides={carouselSlides} />
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
