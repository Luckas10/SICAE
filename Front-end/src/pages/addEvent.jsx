import './Events.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faImage, faIndent, faInfo } from '@fortawesome/free-solid-svg-icons';

export default function AddEvent() {

    return (
        <>
            <Header />
            <div className='events-page'>
                <Sidebar />
                <div className='addEvents-content'>
                    <h2>Criar Evento</h2>
                    <form action="#">
                        <div>
                            <label htmlFor="titulo">Título</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faFont} className="icon" />
                            <input type="text" id="titulo" placeholder="Título do evento" />
                        </div>
                        <div className="input-icon">
                            <label htmlFor="data">Data</label>
                            
                            <input type="date" id="data" placeholder="Data da notícia" />
                        </div>
                        <div className="input-icon">
                            <label htmlFor="hora">Horário</label>
                            
                            <input type="time" id="hora" placeholder="" />
                        </div>
                        <div className="input-icon">
                            <label htmlFor="local">Loocalização</label>
                            
                            <input type="text" id="local" placeholder="" />
                        </div>
                        <div className="input-icon">
                            <label htmlFor="capa">Adicionar capa do evento</label>
                            
                            <input type="text" id="capa" placeholder="" />
                        </div>
                        <div className="input-icon">
                            <label htmlFor="categorias">Categorias</label>
                            
                            <select name="categorias" id="categorias">
                                <option value="#">Esporte</option>
                                <option value="#">Cultura</option>
                                <option value="#">Educação</option>
                            </select>
                        </div>
                        </div>
                        
                        <div>
                            <label htmlFor="texto">Descrição</label>
                            <div className="textarea-icon">
                            <FontAwesomeIcon icon={faIndent} className="icon" style={{marginTop: '0.5rem'}}/>
                            <textarea id="conteudo" placeholder="Digite o conteúdo..."></textarea>
                        </div>
                        
                        </div>



                    </form>
                </div>
            </div>
        </>
    );
}