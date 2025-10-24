import './Sidebar.css'
import Home from '../assets/icons/home-icon.svg'
import Events from '../assets/icons/events-icon.svg'
import Noticias from '../assets/icons/news-icon.svg'
import Usuarios from '../assets/icons/users-icon.svg'
import Configuracoes from '../assets/icons/config-icon.svg'
import Logout from '../assets/icons/logout-icon.svg'


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="links">
        <button className="side-link"><a href="#"><img className="img" src={Home} alt="" /><span>Página Inicial</span></a></button>
        <button className="side-link"><a href="#"><img className="img" src={Events} alt="" /><span>Eventos</span></a></button>
        <button className="side-link"><a href="#"><img className="img" src={Noticias} alt="" /><span>Notícias</span></a></button>
        <button className="side-link"><a href="#"><img className="img" src={Usuarios} alt="" /><span>Usuários</span></a></button>
        <button className="side-link"><a href="#"><img className="img" src={Configuracoes} alt="" /><span>Configurações</span></a></button>
      </div>

      <div className="logout">
        <button className="side-link"><a href="#"><img className="img" src={Logout} alt="" /><span>Sair</span></a></button>
      </div>
    </aside>
  )
}
