import { Corrida } from "../classes/Corrida.js";

const chave = "corridas";

function carregarCorridas() {
    const texto = localStorage.getItem(chave);
    if (!texto) {
        return [];
    }
    const lista = JSON.parse(texto);
    return lista.map((dados) => new Corrida(dados.nome, dados.id));
}

export const corridas = carregarCorridas();

export function salvarCorridas() {
    // Campos privados nao entram no JSON
    const lista = corridas.map((c) => ({ id: c.id, nome: c.nome }));
    localStorage.setItem(chave, JSON.stringify(lista));
}
