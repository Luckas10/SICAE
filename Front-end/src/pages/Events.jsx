import './Events.css';
import Header from '../components/Header.jsx'
import Sidebar
 from '../components/Sidebar.jsx';
export default function Login() {

    return (
        <>
        <div className='events-page'>
            <Header/>
            <div className='events-content'>
                <Sidebar/>
            </div>
        </div>
        </>
    );
}