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
        <button className="side-link"><a href="#"><img className="img" src={Home} alt="" />Página Inicial</a></button>
        <button className="side-link"><a href="#"><img className="img" src={Events} alt="" />Eventos</a></button>
        <button className="side-link"><a href="#"><img className="img" src={Noticias} alt="" />Notícias</a></button>
        <button className="side-link"><a href="#"><img className="img" src={Usuarios} alt="" />Usuários</a></button>
        <button className="side-link"><a href="#"><img className="img" src={Configuracoes} alt="" />Configurações</a></button>
      </div>

      <div className="logout">
        <button className="side-link"><a href="#"><img className="img" src={Logout} alt="" />Sair</a></button>
      </div>
    </aside>
  )
}
