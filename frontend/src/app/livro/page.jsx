import Tabela from "@/src/components/Tabela";
export default function Livro() {
    return (
        <div className="container">
            <h1>📚 Lista de Livros</h1>
            <Tabela categoria= "Livro"/>
            <div className="botoes-bottom">
                <a href="/"><button>Voltar</button></a>
                <button id="sortear-indicacao">Sortear Indicação</button>
            </div>
        </div>
    )
}