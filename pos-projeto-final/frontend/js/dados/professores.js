import { Professor } from "../classes/Professor.js";

const chave = "professores";

function carregarProfessores() {
    const texto = localStorage.getItem(chave);
    if (!texto) {
        return [];
    }
    const lista = JSON.parse(texto);
    return lista.map((dados) => new Professor(dados.nome, dados.id));
}

export const professores = carregarProfessores();

export function salvarProfessores() {
    // Campos privados nao entram no JSON
    const lista = professores.map((c) => ({ id: c.id, nome: c.nome }));
    localStorage.setItem(chave, JSON.stringify(lista));
}
