import headerLogo from '../assets/Logotipo-SICAE.png';
import userIcon from '../assets/user-icon.png';
import './Header.css';

export default function Header () {

    return (
        <header className="header">
            <div className="header-logo">
                <img src={headerLogo} alt="SICAE" />
            </div>
            <div className="user-info">
                <p>Nome de Usuário da Silva Gomes</p>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" />
            </div>
        </header>
    )
};