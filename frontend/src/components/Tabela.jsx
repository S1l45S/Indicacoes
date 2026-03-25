"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function Tabela({ categoria }) {

    const [indicacoes, setInd] = useState([]);

    async function getInd() {
        const indApi = await api.get(`/indicacoes/${categoria}`)
        setInd(indApi.data)
    }
    useEffect(() => {
        if (!categoria) return;
        getInd()
    }, [categoria])

    async function checkAssistido(indicacao) {
        const statusOriginal = indicacao.assistido;
        const novoStatus = !statusOriginal;

        setInd(prevInd =>
            prevInd.map(item =>
                item.id === indicacao.id ? { ...item, assistido: novoStatus } : item
            )
        );
        try {
            await api.put(`/indicacoes/${indicacao.id}`, { assistido: novoStatus });
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            setInd(prevInd =>
                prevInd.map(item =>
                    item.id === indicacao.id ? { ...item, assistido: statusOriginal } : item
                )
            );
            alert("Não foi possível salvar a alteração.");
        }
    }
    return (
        <table>
            <tbody>{indicacoes.map(indicacao => (
                <tr key={indicacao.id} className={indicacao.assistido ? 'riscado' : ''}>
                    <td><input
                        type="checkbox"
                        checked={indicacao.assistido}
                        onChange={() => checkAssistido(indicacao)}
                    /></td>
                    <td>{indicacao.nome}</td>
                    <td>{indicacao.quem}</td>
                    <td><button className="delete-btn"><i className="fas fa-trash"></i></button></td>
                </tr>
            ))}</tbody>
        </table>)
}