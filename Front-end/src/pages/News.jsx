
import './News.css';
import { NavLink } from "react-router-dom";
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import news1 from '../assets/news1.jpg';
import news2 from '../assets/news2.jpeg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

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

                    <div className="sliding-cards">
                        <div className="news-card">
                            <img src={news1} alt="" />
                            <div className="text"><h4>Negão</h4><p>Jogando bola</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news1} alt="" />
                            <div className="text"><h4>Pelézinho </h4><p>Soccer</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news1} alt="" />
                            <div className="text"><h4>E aí negão </h4><p>Veio se entregar?</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news1} alt="" />
                            <div className="text"><h4>Jô Soares</h4><p>The noite</p></div>
                        </div>
                    </div>

                    <div className="bottom-content">
                        <div className="news-card">
                            <img src={news2} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó </h4><p>Caicó chega ao 1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news2} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó </h4><p>Caicó chega ao 1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <nav>
            </nav>
        </>
    );
}