import Tabela from "@/src/components/Tabela";
import"./style.css"

export default function Filme() {
    return (
        <div className="container">
            <h1>📽 Lista de Filmes</h1>
            <Tabela categoria="Filme"/>
            <div className="botoes-bottom">
                <a href="/"><button>Voltar</button></a>
                <button id="sortear-indicacao">Sortear Indicação</button>
            </div>
        </div>
    );
    
}