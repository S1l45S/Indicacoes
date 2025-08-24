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

document.getElementById('sortear-indicacao').addEventListener('click', function() {
    sortearIndicacao();
});


async function carregarIndicacoes() {
    const tabela = document.getElementById("lista");
    const tipoPagina = document.getElementById("tipo").value;
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
            if (indicacao.tipo === tipoPagina) {
                adicionarLinhaTabela(indicacao);
            }
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
    row.dataset.id = indicacao.id; // Adiciona um data-id para identificar a linha

    // Coluna Assistido (checkbox)
    const assistidoCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = indicacao.assistido;

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
    row.appendChild(quemCell);
    row.appendChild(excluirCell);

    tabela.appendChild(row);
}

function sortearIndicacao() {
    const linhas = document.querySelectorAll("#lista tr");
    if (linhas.length === 0) {
        alert("Não há indicações para sortear!");
        return;
    }

    // Remove a classe 'sorteado' de qualquer linha que a tenha
    linhas.forEach(linha => linha.classList.remove('sorteado'));

    const linhaSorteada = linhas[Math.floor(Math.random() * linhas.length)];
    
    // Adiciona a classe 'sorteado' para destacar
    linhaSorteada.classList.add('sorteado');

    // Faz a página rolar até o item sorteado
    linhaSorteada.scrollIntoView({ behavior: 'smooth', block: 'center' });
}