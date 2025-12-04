
import './News.css';
import { NavLink } from "react-router-dom";
import Header from '../components/general/Header.jsx'
import Sidebar from '../components/general/Sidebar.jsx';
import news2 from '../assets/news2.jpeg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import CenterCard from '../components/news/CenterCard.jsx';
import BottomCard from '../components/news/BottomCard.jsx';

export default function News() {

    

    return (
        <>
            <Header />
            <div className='news-page'>
                <Sidebar />
                <div className="news-content">

                    <div className="news-nav">
                        <div className="buscar-content">
                        <label htmlFor="buscar"><FontAwesomeIcon
                            icon={fas.faMagnifyingGlass}
                            className="input-icon"
                        /></label>
                        <input id='buscar' type="text" placeholder="Buscar..." />
                        
                    </div>
                    <NavLink to="./add" id='buttonAdd'><button>+ Adicionar notícia</button></NavLink>
                    </div>

                    {/* Notícias mais relevantes */}
                    <div className="main-content">
                        <div className="news-card">
                            <img src={news2} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó </h4><p>Caicó chega ao 1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news2} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó </h4><p>Caicó chega ao 1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                    </div>

                    {/* Notícias do centro da página */}
                    <div className="sliding-cards">
                        <CenterCard/>
                        <CenterCard/>
                        <CenterCard/>
                        <CenterCard/>
                    </div>
 
                    {/* Notícias mais recentes */}
                    <div className="bottom-content">
                        <BottomCard/>
                        <BottomCard/>
                        <BottomCard/>
                        <BottomCard/>
                        <BottomCard/>
                        <BottomCard/>
                    </div>
                </div>
            </div>
            <nav>
            </nav>
        </>
    );
}