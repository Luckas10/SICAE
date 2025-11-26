import './Profile.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import news2 from '../assets/news2.jpeg';

export default function Profile() {

    return (
        <>
            <Header />
            <div className='profile-page'>
                <Sidebar />
                <div className='profile-content'>
                    <div className="profile-info">
                        <div>
                            <img src={news2} id='image' />
                        <b><p>Nome do usuário</p></b>
                        </div>
                        <div>
                            <div className="card">
                                <p><b>Email:</b>eunicecristina0510@gmail.com</p>
                            </div>
                            <div className="card">
                                <p><b>Matrícula:</b>20221101110019</p>
                            </div>
                            <div className="card">
                                <p><b>Comentarios feitos</b>777</p>
                            </div>
                            <div className="card">
                                <p><b>Eventos participados:</b>777</p>
                            </div>
                        </div>

                    </div>
                    <div className="profile-games">

                    </div>
                </div>
            </div>
        </>
    );
}