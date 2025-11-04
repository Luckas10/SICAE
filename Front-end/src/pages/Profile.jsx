import './Profile.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';

export default function Profile() {

    return (
        <>
            <Header />
            <div className='profile-page'>
                <Sidebar />
                <div className='profile-content'>
                    <p>Conteúdo</p>
                </div>
            </div>
        </>
    );
}