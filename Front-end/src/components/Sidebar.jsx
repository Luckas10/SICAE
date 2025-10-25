import './Sidebar.css'
import Home from '../assets/icons/home-icon.svg?react'
import Events from '../assets/icons/events-icon.svg?react'
import Noticias from '../assets/icons/news-icon.svg?react'
import Usuarios from '../assets/icons/users-icon.svg?react'
import Configuracoes from '../assets/icons/config-icon.svg?react'
import Logout from '../assets/icons/logout-icon.svg?react'


export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="links">
        <button className="side-link"><a href="#"><Home className="img"/><span>Página Inicial</span></a></button>
        <button className="side-link"><a href="#"><Events className="img"/><span>Eventos</span></a></button>
        <button className="side-link"><a href="#"><Noticias className="img"/><span>Notícias</span></a></button>
        <button className="side-link"><a href="#"><Usuarios className="img"/><span>Usuários</span></a></button>
        <button className="side-link"><a href="#"><Configuracoes className="img"/><span>Configurações</span></a></button>
      </div>

      <div className="logout">
        <button className="side-link"><a href="#"><Logout className="img"/><span>Sair</span></a></button>
      </div>
    </aside>
  )
}
