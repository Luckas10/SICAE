import Header from "../components/general/Header";
import Sidebar from "../components/general/Sidebar";
import "./EventGame.css"
export default function EventGame() {
    return (
        <>
            <Header />
            <div className="games-page">
                <Sidebar />

                <div className="games-content">
                    <h2>Criar jogo</h2>
                    <form action="#">
                        <div className="game-colum">
                            <div className="game-div">
                                <label htmlFor="equipe">Equipe 1</label>
                                <input id="equipe" type="text" />

                            </div>
                            <h1>X</h1>
                            <div className="game-div">
                                <label htmlFor="equipe">Equipe 2</label>
                                <input id="equipe" type="text" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="data">Data</label>
                            <input type="date" id="data" />
                            <label htmlFor="horario">Horário</label>

                            <input type="equipe" id="horario" />
                            <label htmlFor="local">Local</label>
                            <input type="text" id="local" />
                            <label htmlFor="observações">Observações</label>
                            <textarea name="obs" id="observações"></textarea>
                            <div className="game-button">
                                <button type="submit">Salvar</button>
                                <button
                                    type="button"
                                    style={{
                                        backgroundColor: "white",
                                        color: "green",
                                    }}

                                >
                                    Cancelar
                                </button>
                            </div>

                        </div>
                    </form>





                </div>
            </div>
        </>
    )
}