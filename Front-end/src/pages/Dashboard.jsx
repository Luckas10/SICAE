import './Dashboard.css';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Carousel from 'react-bootstrap/Carousel';

import img1 from '../assets/carousel/imagem1.jpeg';
import img2 from '../assets/carousel/imagem2.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {

    return (
        <>
            <Header />
            <div className='dashboard-page'>
                <Sidebar />
                <div className='dashboard-content'>
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block"
                                src={img1}
                                alt="Primeiro slide"
                            />
                            <Carousel.Caption>
                                <h3>Primeiro slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
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
                                src={img1}
                                alt="Terceiro slide"
                            />
                            <Carousel.Caption>
                                <h3>Terceiro slide label</h3>
                                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </>
    );
}
