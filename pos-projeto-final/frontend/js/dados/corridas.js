import { Corrida } from "../classes/Corrida.js";
import { CorridaEmAndamento } from "../classes/CorridaEmAndamento.js";
import { listarCorridas } from "../servicos/api.js";

export const corridas = [];

export function criarObjetoCorrida(dados) {
    const totalCheckpoints = dados.total_checkpoints ?? 0;
    const totalPassagens = dados.total_passagens ?? 0;

    if (totalPassagens > 0) {
        return new CorridaEmAndamento(dados.id_corrida, dados.nome, totalCheckpoints, totalPassagens);
    }
    return new Corrida(dados.id_corrida, dados.nome, totalCheckpoints, totalPassagens);
}

export async function carregarCorridas() {
    const lista = await listarCorridas();
    corridas.length = 0;
    for (const dados of lista) {
        corridas.push(criarObjetoCorrida(dados));
    }
}
