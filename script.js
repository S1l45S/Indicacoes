const BIN_ID = '68983e3b43b1c97be91ac5e4';
const API_KEY = '$2a$10$m./zZ7jmLTwtAZt2pCeQSOf0HB2pK9OE3MhOx0cFxtTUO7AkJAu1m';

document.addEventListener("DOMContentLoaded", function() {
    carregarIndicacoes();
});

document.getElementById("form-indicacao").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const quem = document.getElementById("quem").value;

    const id = Date.now().toString();

    await adicionarIndicacao({ id, nome, tipo, quem, assistido: false });
    this.reset();
});

async function carregarIndicacoes() {
    const tabela = document.getElementById("lista");
    tabela.innerHTML = '';

    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': API_KEY,
            }
        });
        const data = await response.json();
        const indicacoes = data.record;
        
        indicacoes.forEach(indicacao => {
            adicionarLinhaTabela(indicacao);
        });
    } catch (error) {
        console.error('Erro ao carregar indicações:', error);
    }
}

async function atualizarIndicacoes(indicacoes) {
    try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
            body: JSON.stringify(indicacoes)
        });
    } catch (error) {
        console.error('Erro ao atualizar a lista:', error);
    }
}

async function adicionarIndicacao(novaIndicacao) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': API_KEY,
            }
        });
        const data = await response.json();
        const indicacoes = data.record;

        indicacoes.push(novaIndicacao);
        
        await atualizarIndicacoes(indicacoes);
        adicionarLinhaTabela(novaIndicacao);

    } catch (error) {
        console.error('Erro ao adicionar indicação:', error);
    }
}

function adicionarLinhaTabela(indicacao) {
    const tabela = document.getElementById("lista");
    const row = document.createElement("tr");

    // Coluna Assistido (checkbox)
    const assistidoCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = indicacao.assistido;

    const cells = {};
    const riscadoClass = 'riscado';
    if(indicacao.assistido){
      row.classList.add(riscadoClass);
    }

    checkbox.addEventListener("change", async function() {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': API_KEY } });
        const data = await response.json();
        const indicacoes = data.record;
        
        const itemParaAtualizar = indicacoes.find(item => item.id === indicacao.id);
        if (itemParaAtualizar) {
            itemParaAtualizar.assistido = this.checked;
        }

        await atualizarIndicacoes(indicacoes);
        
        // Atualiza o estilo localmente
        if (this.checked) {
            row.classList.add(riscadoClass);
        } else {
            row.classList.remove(riscadoClass);
        }
    });
    assistidoCell.appendChild(checkbox);

    // Coluna Nome
    const nomeCell = document.createElement("td");
    nomeCell.textContent = indicacao.nome;
    
    // Coluna Tipo
    const tipoCell = document.createElement("td");
    tipoCell.textContent = indicacao.tipo;
    
    // Coluna Quem
    const quemCell = document.createElement("td");
    quemCell.textContent = indicacao.quem;
    
    // Coluna Excluir
    const excluirCell = document.createElement("td");
    const btnExcluir = document.createElement("button");
    btnExcluir.classList.add("delete-btn");
    btnExcluir.innerHTML = '<i class="fas fa-trash"></i>';
    btnExcluir.addEventListener("click", async function() {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': API_KEY } });
        const data = await response.json();
        let indicacoes = data.record;

        indicacoes = indicacoes.filter(item => item.id !== indicacao.id);
        
        await atualizarIndicacoes(indicacoes);

        tabela.removeChild(row);
    });
    excluirCell.appendChild(btnExcluir);

    row.appendChild(assistidoCell);
    row.appendChild(nomeCell);
    row.appendChild(tipoCell);
    row.appendChild(quemCell);
    row.appendChild(excluirCell);

    tabela.appendChild(row);
}