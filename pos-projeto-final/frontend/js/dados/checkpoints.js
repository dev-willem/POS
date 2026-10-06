import { Checkpoint } from "../classes/Checkpoint.js";
import { corridas } from "./corridas.js";
import { professores } from "./professores.js";

const chave = "checkpoints";

function carregarCheckpoints() {
    const texto = localStorage.getItem(chave);
    if (!texto) {
        return [];
    }
    const lista = JSON.parse(texto);
    const resultado = [];

    for (const dados of lista) {
        // Reconstroi as referencias pelos ids
        const corrida = corridas.find((c) => c.id === dados.corridaId);
        const professor = professores.find((p) => p.id === dados.professorId);

        if (corrida && professor) {
            resultado.push(new Checkpoint(dados.numero, corrida, professor, dados.id));
        }
    }
    return resultado;
}

export const checkpoints = carregarCheckpoints();

export function salvarCheckpoints() {
    const lista = checkpoints.map((c) => ({
        id: c.id,
        numero: c.numero,
        corridaId: c.corrida.id,
        professorId: c.professor.id
    }));
    localStorage.setItem(chave, JSON.stringify(lista));
}
