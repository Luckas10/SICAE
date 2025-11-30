import { useUser } from "../../context/UserContext";
import headerLogo from '../../assets/Logotipo-SICAE.png';
import './Header.css';

const DEFAULT_AVATAR =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function Header() {

    const { user, loadingUser } = useUser();

    return (
        <header className="header">
            <div className="header-logo">
                <img src={headerLogo} alt="SICAE" />
            </div>

            <div className="user-info">
                <p>{loadingUser ? "Carregando..." : user?.full_name}</p>
                <img
                    src={user?.profile_image || DEFAULT_AVATAR}
                    alt="Foto de perfil"
                />
            </div>
        </header>
    );
}
