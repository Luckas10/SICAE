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
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block"
                                    src={img2}
                                    alt="Segundo slide"
                                />
                                <Carousel.Caption>
                                    <h3>Segundo slide label</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block"
                                    src={img3}
                                    alt="Terceiro slide"
                                />
                                <Carousel.Caption>
                                    <h3>Terceiro slide label</h3>
                                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
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
                                <p>repellat asperiores? Quibusasdasfausfuasgifkasukfkvhasufhgjhkhlskfgvhjasfhvj asbhklfbvasg jfagsvgh fgajsv fvjagsvfgvjhasfassdam laudantium suscipit nemo enim. Repellat fugit debitis ad. Quod facere rerum commodi fugiat.</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={card2} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faNewspaper} />NOTÍCIA</p>
                                <p>repellat asperiores? Quibusdam laudantium suscipit nemo enim. Repellat fugit debitis ad. Quod facere rerum commodi fugiat.</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={card3} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faCalendarDays} />EVENTO</p>
                                <p>repellat asperiores? Quibusdam laudantium suscipit nemo enim. Repellat fugit debitis ad. Quod facere rerum commodi fugiat.</p>
                            </div>
                        </div>
                        <div className="card">
                            <img src={card1} />
                            <div className='cardText'>
                                <p id='cardType'><FontAwesomeIcon icon={fas.faCalendarDays} />EVENTO</p>
                                <p>repellat asperiores? Quibusdam laudantium suscipit nemo enim. Repellat fugit debitis ad. Quod facere rerum commodi fugiat.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
