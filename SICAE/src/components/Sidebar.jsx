import './Sidebar.css'
import Home from '../assets/icones/5.png'
import Events from '../assets/icones/4.png'
import Noticias from '../assets/icones/1.png'
import Usuarios from '../assets/icones/2.png'
import Configuracoes from '../assets/icones/3.png'

export default function Sidebar () {
    return (
        <aside className="sidebar">
           <div className="links">
             <button className='side-link'><a href="#" ><img className='img' src={Home} alt="" />Página Inicial</a></button>
             <button className='side-link'><a href="#" > <img className='img' src={Events} alt="" />Eventos</a></button>
             <button className='side-link'><a href="#" ><img className='img' src={Noticias} alt="" /> Notícias</a></button>
             <button className='side-link'><a href="#" ><img className='img' src={Usuarios} alt="" />Usuários</a></button>
             <button className='side-link'><a href="#" ><img className='img' src={Configuracoes} alt="" />Configurações</a></button>
             

           </div>
           
        </aside>
    )
}