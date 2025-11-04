import './News.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';

export default function News() {

    return (
        <>
            <Header />
            <div className='news-page'>
                <Sidebar />
                <div className='news-content'>
                    <p>Conteúdo</p>
                </div>
            </div>
        </>
    );
}