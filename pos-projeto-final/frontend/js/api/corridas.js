import { requisicao } from "./http.js";
import { caminhoDoId } from "./id.js";
import { Corrida } from "../classes/Corrida.js";

function paraCorrida(dados) {
    return new Corrida(dados.nome, dados.id, dados.status);
}

export async function listarCorridas() {
    const lista = await requisicao("/corridas");
    return lista.map(paraCorrida);
}

export async function buscarCorrida(id) {
    return paraCorrida(await requisicao(`/corridas/${caminhoDoId(id)}`));
}

// Recebe uma Corrida ainda sem id e devolve a corrida salva, com o id gerado pela API
export async function cadastrarCorrida(corrida) {
    const dados = await requisicao("/corridas", {
        metodo: "POST",
        corpo: { nome: corrida.nome, status: corrida.status }
    });
    return paraCorrida(dados);
}

// Altera so os campos informados, ex.: { nome } ou { status }
export async function atualizarCorrida(id, campos) {
    return paraCorrida(await requisicao(`/corridas/${caminhoDoId(id)}`, { metodo: "PATCH", corpo: campos }));
}

export async function removerCorrida(id) {
    await requisicao(`/corridas/${caminhoDoId(id)}`, { metodo: "DELETE" });
}
