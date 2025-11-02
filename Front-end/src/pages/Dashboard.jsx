import './Dashboard.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import ImageCarousel from '../components/ImageCarousel.jsx';

import img1 from '../assets/carousel/imagem1.jpeg';
import img2 from '../assets/carousel/imagem2.jpeg';

export default function Dashboard() {

    return (
        <>
        <Header />
            <div className='dashboard-page'>
                <Sidebar />
                <div className='dashboard-content'>
                    <ImageCarousel images={[img1, img2]} />
                </div>
            </div>
        </>
    );
}