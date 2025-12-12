import "./News.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, fas } from "@fortawesome/free-solid-svg-icons";

import TopCard from "../components/news/TopCard.jsx";
import CenterSlider from "../components/news/CenterSlider.jsx";
import BottomCard from "../components/news/BottomCard.jsx";

import api from "../services/api";
import { CATEGORY_CONFIG } from "../constants/eventCategories.js";
import { useUser } from "../context/UserContext.jsx";

export default function News() {
    const { user, loadingUser } = useUser();

    const [news, setNews] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await api.get("/news/");
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

    useEffect(() => {
        setCurrentPage(1);
    }, [search, categoryFilter]);

    const filteredBySearch = news.filter((item) => {
        const text = search.toLowerCase();

        const matchText =
            item.title?.toLowerCase().includes(text) ||
            item.add_info?.toLowerCase().includes(text) ||
            item.category?.toLowerCase().includes(text);

        const matchCategory =
            !categoryFilter || item.category === categoryFilter;

        return matchText && matchCategory;
    });

    const isSearching =
        search.trim().length > 0 || categoryFilter.trim().length > 0;

    const sortedNews = [...news].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const topRaw = sortedNews.filter(n => n.priority === "top");
    const centerRaw = sortedNews.filter(n => n.priority === "center");
    const noneRaw = sortedNews.filter(n => !n.priority || n.priority === "none");

    const topNews = topRaw.slice(0, 2);
    const overflowTop = topRaw.slice(2);

    const centerNews = centerRaw.slice(0, 8);
    const overflowCenter = centerRaw.slice(8);

    const bottomNews = [
        ...overflowTop,
        ...overflowCenter,
        ...noneRaw
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const searchResults = [...filteredBySearch].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const totalPages = Math.ceil(bottomNews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedBottomNews = bottomNews.slice(startIndex, endIndex);

    return (
        <>
            <Header />

            <main className="news-page">
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

                            <input
                                id="buscar"
                                type="text"
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                className="news-category-filter"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Todas categorias</option>

                                {Object.entries(CATEGORY_CONFIG).map(([key, category]) => (
                                    <option key={key} value={key}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!loadingUser && user?.role === "Servidor" && (
                            <NavLink to="./add" id="buttonAdd">
                                <button>+ Adicionar notícia</button>
                            </NavLink>
                        )}
                    </div>

                    {isSearching ? (
                        <div className="full-content">
                            {searchResults.length > 0 ? (
                                searchResults.map((item) => (
                                    <BottomCard key={item.id} data={item} />
                                ))
                            ) : (
                                <p style={{ marginTop: "2rem", color: "#777" }}>
                                    Nenhuma notícia encontrada.
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="main-content">
                                {topNews.map((item) => (
                                    <TopCard key={item.id} data={item} />
                                ))}
                            </div>

                            <CenterSlider news={centerNews} />

                            <div className="bottom-content">
                                {paginatedBottomNews.map((item) => (
                                    <BottomCard key={item.id} data={item} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    >
                                        <FontAwesomeIcon icon={faAngleLeft} />
                                    </button>

                                    <span>Página {currentPage} de {totalPages}</span>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    >
                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
