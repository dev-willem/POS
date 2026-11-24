import { requisicao } from "./http.js";
import { caminhoDoId, mesmoId } from "./id.js";
import { Checkpoint } from "../classes/Checkpoint.js";

// Na API o checkpoint guarda so os ids; em memoria referencia os objetos Corrida e Professor
export async function listarCheckpoints(corridas, professores) {
    const lista = await requisicao("/checkpoints");

    return lista.flatMap((dados) => {
        const corrida = corridas.find((c) => mesmoId(c.id, dados.corridaId));
        const professor = professores.find((p) => mesmoId(p.id, dados.professorId));
        return corrida && professor
            ? [new Checkpoint(dados.numero, corrida, professor, dados.id)]
            : [];
    });
}

// Registros brutos (ids e numero), usados pelas validacoes de integridade.
// O filtro e feito aqui e nao com ?corridaId=: o filtro do JSON Server nao casa ids textuais
// que parecem numeros (ex.: "42"), e isso desligaria as regras de exclusao e de numero repetido.
export async function buscarCheckpointsDaCorrida(corridaId) {
    const lista = await requisicao("/checkpoints");
    return lista.filter((c) => mesmoId(c.corridaId, corridaId));
}

export async function buscarCheckpointsDoProfessor(professorId) {
    const lista = await requisicao("/checkpoints");
    return lista.filter((c) => mesmoId(c.professorId, professorId));
}

// Recebe um Checkpoint ainda sem id e devolve o checkpoint salvo, com o id gerado pela API
export async function cadastrarCheckpoint(checkpoint) {
    const dados = await requisicao("/checkpoints", {
        metodo: "POST",
        corpo: {
            numero: checkpoint.numero,
            corridaId: checkpoint.corrida.id,
            professorId: checkpoint.professor.id
        }
    });
    return new Checkpoint(dados.numero, checkpoint.corrida, checkpoint.professor, dados.id);
}

// campos: { numero, corridaId, professorId }
export async function atualizarCheckpoint(id, campos) {
    await requisicao(`/checkpoints/${caminhoDoId(id)}`, { metodo: "PATCH", corpo: campos });
}

export async function removerCheckpoint(id) {
    await requisicao(`/checkpoints/${caminhoDoId(id)}`, { metodo: "DELETE" });
}
