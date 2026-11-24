import { carregarDados } from "../api/dados.js";
import { buscarCorrida } from "../api/corridas.js";
import { buscarProfessor } from "../api/professores.js";
import { atualizarCheckpoint, buscarCheckpointsDaCorrida, cadastrarCheckpoint, removerCheckpoint } from "../api/checkpoints.js";
import { mesmoId } from "../api/id.js";
import { Checkpoint } from "../classes/Checkpoint.js";
import { criarItemCheckpoint, criarMensagemVazia, criarOpcoes } from "./componentes.js";
import { executar, limparStatus, mostrarStatus } from "./mensagens.js";

const lista = document.querySelector("#lista-checkpoints");
const botaoNovo = document.querySelector("#novo-checkpoint");
const modal = document.querySelector("#modal-checkpoint");
const formulario = document.querySelector("#form-checkpoint");
const titulo = document.querySelector("#titulo-formulario");
const campoId = document.querySelector("#checkpoint-id");
const campoNumero = document.querySelector("#checkpoint-numero");
const campoCorrida = document.querySelector("#checkpoint-corrida");
const campoProfessor = document.querySelector("#checkpoint-professor");
const botaoCancelar = document.querySelector("#cancelar-checkpoint");

let corridas = [];
let professores = [];
let checkpoints = [];

// Busca os dados na API e redesenha a lista
async function atualizar() {
    try {
        ({ corridas, professores, checkpoints } = await carregarDados());
    } catch (erro) {
        mostrarStatus(`Não foi possível carregar os checkpoints. ${erro.message}`);
        return;
    }
    limparStatus();
    renderizarCheckpoints();
}

function renderizarCheckpoints() {
    lista.innerHTML = "";

    if (checkpoints.length === 0) {
        lista.appendChild(criarMensagemVazia("Nenhum checkpoint cadastrado."));
        return;
    }

    // Ordena por corrida e numero
    const ordenados = [...checkpoints].sort((a, b) =>
        a.corrida.nome.localeCompare(b.corrida.nome) || a.numero - b.numero
    );

    for (const checkpoint of ordenados) {
        lista.appendChild(criarItemCheckpoint(checkpoint, {
            aoAlterar: abrirFormularioAlteracao,
            aoExcluir: (c) => excluirCheckpoint(c.id)
        }));
    }
}

function abrirFormularioNovoCheckpoint() {
    if (corridas.length === 0 || professores.length === 0) {
        mostrarStatus("Cadastre ao menos uma corrida (página Corridas) e um professor (página Professores) antes de criar um checkpoint.");
        return;
    }

    const iniciadas = corridas.filter((c) => c.aceitaCheckpoints);
    if (iniciadas.length === 0) {
        mostrarStatus("Nenhuma corrida iniciada. Inicie uma corrida (página Corridas) para registrar checkpoints.");
        return;
    }

    limparStatus();
    titulo.textContent = "Novo checkpoint";
    campoId.value = "";
    campoNumero.value = "";
    campoCorrida.replaceChildren(...criarOpcoes("Selecione a corrida", iniciadas));
    campoProfessor.replaceChildren(...criarOpcoes("Selecione o professor", professores));
    modal.showModal();
}

function abrirFormularioAlteracao(checkpoint) {
    limparStatus();
    titulo.textContent = "Alterar checkpoint";
    campoId.value = checkpoint.id;
    campoNumero.value = checkpoint.numero;
    // Alem das iniciadas, mantem a corrida atual do checkpoint, mesmo encerrada
    const disponiveis = corridas.filter((c) => c.aceitaCheckpoints || mesmoId(c.id, checkpoint.corrida.id));
    campoCorrida.replaceChildren(...criarOpcoes("Selecione a corrida", disponiveis));
    campoProfessor.replaceChildren(...criarOpcoes("Selecione o professor", professores));
    campoCorrida.value = checkpoint.corrida.id;
    campoProfessor.value = checkpoint.professor.id;
    modal.showModal();
}

// Regra de negocio: so corridas iniciadas recebem novos registros de checkpoint.
// Recebe a corrida lida da API no momento da operacao, nao a que esta na tela.
function exigirCorridaIniciada(corrida) {
    if (!corrida.aceitaCheckpoints) {
        throw new Error(`A corrida "${corrida.nome}" está ${corrida.status}. Só é possível registrar checkpoints em corridas Iniciadas.`);
    }
}

// Numero nao pode se repetir na mesma corrida (consulta os checkpoints atuais da API)
async function exigirNumeroLivre(numero, corrida, idIgnorado = null) {
    const existentes = await buscarCheckpointsDaCorrida(corrida.id);
    if (existentes.some((c) => c.numero === numero && (idIgnorado === null || !mesmoId(c.id, idIgnorado)))) {
        throw new Error(`Já existe o checkpoint ${numero} na corrida "${corrida.nome}".`);
    }
}

async function criarCheckpoint({ numero, corridaId, professorId }) {
    const ok = await executar("Não foi possível cadastrar o checkpoint.", async () => {
        const [corrida, professor] = await Promise.all([buscarCorrida(corridaId), buscarProfessor(professorId)]);
        exigirCorridaIniciada(corrida);
        await exigirNumeroLivre(numero, corrida);
        await cadastrarCheckpoint(new Checkpoint(numero, corrida, professor));
    });
    if (ok) {
        await atualizar();
    }
}

async function alterarCheckpoint({ id, numero, corridaId, professorId }) {
    const atual = checkpoints.find((c) => mesmoId(c.id, id));

    const ok = await executar("Não foi possível alterar o checkpoint.", async () => {
        const [corrida, professor] = await Promise.all([buscarCorrida(corridaId), buscarProfessor(professorId)]);
        // Mover o checkpoint para outra corrida equivale a registra-lo nela
        if (!mesmoId(corrida.id, atual.corrida.id)) {
            exigirCorridaIniciada(corrida);
        }
        await exigirNumeroLivre(numero, corrida, id);
        await atualizarCheckpoint(id, { numero, corridaId: corrida.id, professorId: professor.id });
    });
    if (ok) {
        await atualizar();
    }
}

async function excluirCheckpoint(id) {
    if (!confirm("Deseja realmente excluir este checkpoint?")) {
        return;
    }

    if (await executar("Não foi possível excluir o checkpoint.", () => removerCheckpoint(id))) {
        await atualizar();
    }
}

export async function inicializar() {
    botaoNovo.addEventListener("click", abrirFormularioNovoCheckpoint);

    botaoCancelar.addEventListener("click", () => modal.close());

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        // Os ids ficam como texto, exatamente como vem do formulario e da API
        const dados = {
            id: campoId.value,
            numero: Number(campoNumero.value),
            corridaId: campoCorrida.value,
            professorId: campoProfessor.value
        };
        formulario.reset();
        modal.close();

        if (dados.id) {
            await alterarCheckpoint(dados);
        } else {
            await criarCheckpoint(dados);
        }
    });

    await atualizar();
}
