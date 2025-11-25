import './Events.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import event1 from '../assets/event1.png'
import news1 from '../assets/news1.jpg'
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function Events() {

    return (
        <>
            <Header />
            <div className='events-page'>
                <Sidebar />
                <div className='events-content'>
                    <div className="sports-content">
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                        <img src={event1} alt="" />
                    </div>
                    <NavLink to="./add" id='buttonAdd'><button>+ Adicionar evento</button></NavLink>
                    <div className="cards">
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faFutbol} className='futsalIcon' /> FUTSAL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faBasketball} className='basketballIcon' /> BASQUETE</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faTableTennis} className='tabletennisIcon' /> TÊNIS DE MESA</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faHandBackFist} className='fightingIcon' /> LUTAS</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faPersonRunning} className='athleticsIcon' /> ATLETISMO</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faVolleyball} className='volleyballIcon' /> VOLEIBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faWater} className='swimmingIcon' /> NATAÇÃO</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon icon={fas.faGamepad} className='esportsIcon' /> E-SPORTS</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
}