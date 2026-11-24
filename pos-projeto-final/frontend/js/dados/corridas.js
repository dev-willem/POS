import { Corrida } from "../classes/Corrida.js";

const chave = "corridas";

function carregarCorridas() {
    const texto = localStorage.getItem(chave);
    if (!texto) {
        return [];
    }
    const lista = JSON.parse(texto);
    // Corridas salvas antes do controle de status voltam como "Criada"
    return lista.map((dados) => new Corrida(dados.nome, dados.id, dados.status ?? Corrida.STATUS.CRIADA));
}

export const corridas = carregarCorridas();

export function salvarCorridas() {
    // Campos privados nao entram no JSON
    const lista = corridas.map((c) => ({ id: c.id, nome: c.nome, status: c.status }));
    localStorage.setItem(chave, JSON.stringify(lista));
}
