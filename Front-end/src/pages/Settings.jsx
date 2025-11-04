import './Settings.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';

export default function Settings() {

    return (
        <>
            <Header />
            <div className='settings-page'>
                <Sidebar />
                <div className='settings-content'>
                    <p>Conteúdo</p>
                </div>
            </div>
        </>
    );
}