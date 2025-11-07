import './Events.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';

export default function Events() {

    return (
        <>
            <Header />
            <div className='events-page'>
                <Sidebar />
            </div>
        </>
    );
}