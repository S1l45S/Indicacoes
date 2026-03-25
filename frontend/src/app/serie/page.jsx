import Tabela from "@/src/components/Tabela";
import"./style.css"
export default function Serie() {
    return (
        <div className="container">
            <h1>🎬 Lista de Séries</h1>
            <Tabela categoria= "Série"/>
            <div className="botoes-bottom">
                <a href="/"><button>Voltar</button></a>
                <button id="sortear-indicacao">Sortear Indicação</button>
            </div>
        </div>
    )
}