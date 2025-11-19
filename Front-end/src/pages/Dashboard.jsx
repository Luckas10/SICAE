import './Dashboard.css';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Carousel from 'react-bootstrap/Carousel';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import img1 from '../assets/carousel/imagem1.png';
import img2 from '../assets/carousel/imagem2.jpeg';
import img3 from '../assets/carousel/imagem3.jpg';
import card1 from '../assets/card1.jpg';
import card2 from '../assets/card2.jpg';
import card3 from '../assets/card3.jpg';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {

    return (
        <>
            <Header />
            <div className='dashboard-page'>
                <Sidebar />
                <div className='dashboard-content'>
                    <div className="main-content">
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    className="d-block"
                                    src={img1}
                                    alt="Primeiro slide"
                                />
                                <Carousel.Caption>
                                    <h3>IF BRILHA NO INTERCAMPI</h3>
                                    <p>ATLETAS DO SICAE BRILHARAM ESTA NOITE, FAZENDO UM ESPETÁCULO EM SEUS RESPECTIVOS ESPORTES</p>
                                    <span className="carousel-date">17 de Novembro de 2025</span>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>

                        <div className="notifications">
                            <div className='notifications-upper'>
                                <FontAwesomeIcon icon={far.faBell} className='bell-icon' />
                            </div>
                        </div>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <img src={card1} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faCalendarDays} />EVENTO</p>
                                <p>Equipe de Vôlei do Campus Garante Vitória em Jogo Acirrado</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={card2} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faNewspaper} />NOTÍCIA</p>
                                <p>Atletas do Badminton do IFRN se Destacam em Competição Regional</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={card3} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faCalendarDays} />EVENTO</p>
                                <p>Treinador Ricardo Anuncia Novo Cursinho de Futsal para Iniciantes e Atletas em Formação</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={card1} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faCalendarDays} />EVENTO</p>
                                <p>Equipe de Vôlei do Campus Garante Vitória em Jogo Acirrado</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
