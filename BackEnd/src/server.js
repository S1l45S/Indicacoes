require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BIN_ID = process.env.BIN_ID;
const MASTER_KEY = process.env.MASTER_KEY;

const api = axios.create({
    baseURL: `https://api.jsonbin.io/v3/b/${BIN_ID}`,
    headers: { "X-Master-Key": MASTER_KEY }
});

async function carregarIndicacoes() {
    const response = await api.get('/latest');
    return response.data.record;
}

async function criar(novaInd, tipo) {
    if (!novaInd.nome || !novaInd.quem) {
        throw new Error("Campos obrigatórios faltando.");
    }

    const atuais = await carregarIndicacoes();
    const novaIndComId = {
        id: Date.now().toString(),
        ...novaInd,
        tipo,
        assistido: false
    }

    atuais.push(novaIndComId);

    await api.put("/", atuais);

    return novaIndComId;

}

async function atualizar(id, assistido) {

    let indicacoes = await carregarIndicacoes();

    let itemEncontrado = false;
    indicacoes = indicacoes.map(item => {
        if (item.id === id) {
            itemEncontrado = true;
            return { ...item, assistido: assistido };
        }
        return item;
    });

    if (itemEncontrado) {
        await api.put("/", indicacoes);
        return true

    }

    return false
}



async function deletar(id) {

    let indicacoes = await carregarIndicacoes();
    indicacoes = indicacoes.filter(item => item.id != id);

    await api.put("/", indicacoes);
    return indicacoes;
}

app.get("/indicacoes/:tipo", async (req, res) => {
    try {
        const { tipo } = req.params;
        const indicacoes = await carregarIndicacoes();

        const filtrados = indicacoes.filter(
            item => item.tipo.toLowerCase() === tipo.toLowerCase()
        );

        res.json(filtrados);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao carregar dados" });
    }
});

app.post("/indicacoes/:tipo", async (req, res) => {
    try {
        const novaInd = req.body
        const tipo = req.params.tipo
        const resultado = await criar(novaInd, tipo);
        res.status(201).json(resultado);
    }
    catch (erro) {
        console.error("Erro ao salvar:", erro);
        res.status(500).json({ erro: "Erro ao salvar a indicação no banco." });
    }
});

app.put("/indicacoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { assistido } = req.body;

        const sucesso = await atualizar(id, assistido);

        if (!sucesso) {
            return res.status(404).json({ erro: "Indicação não encontrada." });
        }

        res.json({ mensagem: "Status atualizado com sucesso!", id });

    } catch (erro) {
        console.error("Erro ao atualizar:", erro);
        res.status(500).json({ erro: "Erro interno ao atualizar status." });
    }
});


app.delete("/indicacoes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await deletar(id);

        res.json({ mensagem: "Deletado com sucesso!", resultado });

    } catch (erro) {
        console.error("Erro ao atualizar:", erro);
        res.status(500).json({ erro: "Erro interno ao atualizar status." });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em ${PORT}`);
});