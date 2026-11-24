import { requisicao } from "./http.js";
import { caminhoDoId } from "./id.js";
import { Professor } from "../classes/Professor.js";

function paraProfessor(dados) {
    return new Professor(dados.nome, dados.id);
}

export async function listarProfessores() {
    const lista = await requisicao("/professores");
    return lista.map(paraProfessor);
}

export async function buscarProfessor(id) {
    return paraProfessor(await requisicao(`/professores/${caminhoDoId(id)}`));
}

// Recebe um Professor ainda sem id e devolve o professor salvo, com o id gerado pela API
export async function cadastrarProfessor(professor) {
    const dados = await requisicao("/professores", {
        metodo: "POST",
        corpo: { nome: professor.nome }
    });
    return paraProfessor(dados);
}

export async function atualizarProfessor(id, campos) {
    return paraProfessor(await requisicao(`/professores/${caminhoDoId(id)}`, { metodo: "PATCH", corpo: campos }));
}

export async function removerProfessor(id) {
    await requisicao(`/professores/${caminhoDoId(id)}`, { metodo: "DELETE" });
}
