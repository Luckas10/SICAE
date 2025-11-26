import './Profile.css';
import Header from '../components/general/Header.jsx'
import Sidebar from '../components/general/Sidebar.jsx';

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