"use client";
import { useState, useEffect } from "react";
import api from "../services/api";
export default function Tabela({ categoria }) {

    const [indicacoes, setInd] = useState([]);
    const [modalInfo, setModalInfo] = useState(null);
    const [carregandoExtra, setCarregandoExtra] = useState(false);

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

    async function abrirDetalhes(nome) {
        setCarregandoExtra(true);
        try {
            const res = await api.get(`/detalhes-extras/${categoria}/${nome}`);
            setModalInfo({ ...res.data, nome: nome });
        } catch (error) {
            alert("Não foi possível encontrar detalhes deste Conteudo.");
        } finally {
            setCarregandoExtra(false);
        }
    }

    const getFontSize = (texto) => {
        if (!texto) return '1rem';
        const tamanho = texto.length;

        if (tamanho > 600) return '0.75rem';
        if (tamanho > 300) return '0.85rem';
        return '1rem'; 
    };

    return (
        <>
            <table>
                <tbody>{indicacoes.map(indicacao => (
                    <tr key={indicacao.id} className={indicacao.assistido ? 'riscado' : ''}>
                        <td><input
                            type="checkbox"
                            checked={indicacao.assistido}
                            onChange={() => checkAssistido(indicacao)}
                        /></td>
                        <td className="nome-cell">
                            <span>{indicacao.nome}</span>
                            <button
                                className="info-btn-inline"
                                onClick={() => abrirDetalhes(indicacao.nome)}
                                disabled={carregandoExtra}
                                title="Ver detalhes"
                            >
                                <i className="fas fa-info-circle"></i>
                            </button>
                        </td>
                        <td>{indicacao.quem}</td>
                        <td><button className="delete-btn"><i className="fas fa-trash"></i></button></td>
                    </tr>
                ))}</tbody>
            </table>
            {modalInfo && (
                <div className="modal-overlay" onClick={() => setModalInfo(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setModalInfo(null)}>&times;</button>

                        {modalInfo.capa && <img src={modalInfo.capa} alt={modalInfo.nome} />}

                        <div className="modal-text">
                            <h2>{modalInfo.nome}</h2>
                            <span className="nota-badge">⭐ {modalInfo.nota}</span>
                            <p style={{ fontSize: getFontSize(modalInfo.sinopse) }}>
                                {modalInfo.sinopse}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}