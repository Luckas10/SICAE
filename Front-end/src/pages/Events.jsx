import './Events.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import event1 from '../assets/event1.png'
import news1 from '../assets/news1.jpg'
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
                    <div className="cards">
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                            
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>
                        <div className="event-card">
                            <img src={news1} alt="" />
                            <p className='sportsNewsId' ><FontAwesomeIcon size="lg" icon={fas.faCalendarWeek} style={{ marginBottom: "1px"}} /> FUTEBOL</p>
                            <h5>Seletiva para os jogos de Intercampi 2025</h5>
                        </div>

                    </div>
                   
                </div>
            </div>
            
        </>
    );
}