
import './News.css';
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
                    <div className="buscar-content">
                        
                        
                        <label htmlFor="buscar"><FontAwesomeIcon 
                            icon={fas.faMagnifyingGlass} 
                            className="input-icon"
                        /></label>
                        <input id='buscar' type="text" placeholder="Buscar..." />
                       
                    </div>
                    <div className="cards">
                        <div className="news-card">
                            <img src={news2} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó consegue </h4><p>1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news2} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó consegue </h4><p>1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                         
                    </div>

                    <div className="cards">
                        <div className="news-card">
                            <img src={news1} alt="" />
                            
                            <div className="text"><h4>IFRN Campus Caicó consegue </h4><p>1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news1} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó consegue </h4><p>1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                        <div className="news-card">
                            <img src={news1} alt="" />
                            <div className="text"><h4>IFRN Campus Caicó consegue </h4><p>1° lugar em campeonato de futebol estadual</p></div>
                        </div>
                        
                        
                         
                    </div>

                </div>
            </div>

            <nav>
                
            </nav>
        </>
    );
}