import './Events.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import event1 from '../assets/event1.png'
import news1 from '../assets/news1.jpg'

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
                   
                </div>
            </div>
            <div className="cards">
                <div className="event-card">
                    <img src={news1} alt="" />
                </div>

            </div>
        </>
    );
}