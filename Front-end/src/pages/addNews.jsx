import './News.css';
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx';

export default function AddNews() {

    return (
        <>
            <Header />
            <div className='news-page'>
                <Sidebar />
                <div className='addNews-content'>
                    <h2>Criar Notícia</h2>
                    <form action="#">
                        <label htmlFor="titulo">Título</label>
                        <input type="text" id='titulo' />
                        <label htmlFor="capa" >Adicionar capa da noticia
                            <input type="text"  style={{backgroundColor:"white",border:"none"}}/>
                        </label>
                        
                        <label htmlFor="conteudo">Conteúdo da notícia</label>
                        <textarea name="conteudo" id="conteudo"></textarea>
                        <label htmlFor="info">Informações adicionais</label>
                        <input type="text" id='info' />
                        <label htmlFor="esporte">Esporte</label>
                        <select name="esporte" id="esporte">
                            <option value="#">Futsal</option>
                            <option value="#">Vôlei</option>
                            <option value="#">Basquete</option>
                        </select>
                        <button>Salvar</button>
                    </form>

                </div>
            </div>
        </>
    );
}