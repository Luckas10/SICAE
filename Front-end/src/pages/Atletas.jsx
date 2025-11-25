
import './Atletas.css';
import { NavLink } from "react-router-dom";
import Header from '../components/general/Header.jsx'
import Sidebar from '../components/general/Sidebar.jsx';
import test from "../assets/eventsIcons/event1.png";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function Atletas() {

    return (
        <>
            <Header />
            <div className='atletas-page'>
                <Sidebar />
                <div className="atletas-content">

                    <div className="atletas-nav">
                       <div className="buscar-content">
                        <label htmlFor="buscar"><FontAwesomeIcon
                            icon={fas.faMagnifyingGlass}
                            className="input-icon"
                        /></label>
                        <input id='buscar' type="text" placeholder="Buscar..." />
                        </div>
                        
                        
                        
                    </div>
                    
                    </div>
                    <h1>Atletas</h1>
                    <div className="main-content">
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        <div>
                            <label htmlFor="atleta">Atleta</label>
                            <img src={test} id='atleta' alt="" />
                        </div>
                        
                    </div>

                    

                    
                </div>
        
            <nav>
            </nav>
        </>
    );
}