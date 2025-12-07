import "./News.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import TopCard from "../components/news/TopCard.jsx";
import CenterCard from "../components/news/CenterCard.jsx";
import BottomCard from "../components/news/BottomCard.jsx";

import api from "../services/api";

import CenterSlider from "../components/news/CenterSlider.jsx";

export default function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await api.get("/news");
                const raw = response.data;

                const list = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.data)
                        ? raw.data
                        : Array.isArray(raw?.news)
                            ? raw.news
                            : [];

                setNews(list);
            } catch (err) {
                console.error("Erro ao buscar notícias:", err);
                setNews([]);
            }
        }

        fetchNews();
    }, []);

    const topNews = news
        .filter((n) => n.priority === "top")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 2);

    const centerNews = news.filter((n) => n.priority === "center");

    const bottomNews = news
        .filter((n) => !n.priority || n.priority === "none")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <>
            <Header />

            <div className="news-page">
                <Sidebar />

                <div className="news-content">
                    <div className="news-nav">
                        <div className="buscar-content">
                            <label htmlFor="buscar">
                                <FontAwesomeIcon
                                    icon={fas.faMagnifyingGlass}
                                    className="input-icon"
                                />
                            </label>

                            <input id="buscar" type="text" placeholder="Buscar..." />
                        </div>

                        <NavLink to="./add" id="buttonAdd">
                            <button>+ Adicionar notícia</button>
                        </NavLink>
                    </div>

                    {/* Notícias destaque (topo) */}
                    <div className="main-content">
                        {topNews.map((item) => (
                            <TopCard key={item.id} data={item} />
                        ))}
                    </div>
                    
                    {/* Notícias do centro */}
                    <CenterSlider news={centerNews} />

                    {/* Notícias mais recentes/sem prioridade */}
                    <div className="bottom-content">
                        {bottomNews.map((item) => (
                            <BottomCard key={item.id} data={item} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
