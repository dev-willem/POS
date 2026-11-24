import { carregarDados } from "../api/dados.js";
import { atualizarCorrida, buscarCorrida, cadastrarCorrida, removerCorrida } from "../api/corridas.js";
import { buscarCheckpointsDaCorrida } from "../api/checkpoints.js";
import { mesmoId } from "../api/id.js";
import { Corrida } from "../classes/Corrida.js";
import { criarItemCorrida, criarMensagemVazia } from "./componentes.js";
import { executar, limparStatus, mostrarStatus } from "./mensagens.js";

const lista = document.querySelector("#lista-corridas");
const botaoNova = document.querySelector("#nova-corrida");
const modal = document.querySelector("#modal-corrida");
const formulario = document.querySelector("#form-corrida");
const titulo = document.querySelector("#titulo-formulario");
const campoId = document.querySelector("#corrida-id");
const campoNome = document.querySelector("#corrida-nome");
const botaoCancelar = document.querySelector("#cancelar-corrida");

let corridas = [];
let checkpoints = [];

// Busca os dados na API e redesenha a lista
async function atualizar() {
    try {
        ({ corridas, checkpoints } = await carregarDados());
    } catch (erro) {
        mostrarStatus(`Não foi possível carregar as corridas. ${erro.message}`);
        return;
    }
    limparStatus();
    renderizarCorridas();
}

function renderizarCorridas() {
    lista.innerHTML = "";

    if (corridas.length === 0) {
        lista.appendChild(criarMensagemVazia("Nenhuma corrida cadastrada."));
        return;
    }

    for (const corrida of corridas) {
        const total = checkpoints.filter((c) => mesmoId(c.corrida.id, corrida.id)).length;

        lista.appendChild(criarItemCorrida(corrida, total, {
            aoIniciar: iniciarCorrida,
            aoEncerrar: encerrarCorrida,
            aoAlterar: abrirFormularioAlteracao,
            aoExcluir: (c) => excluirCorrida(c.id)
        }));
    }
}

// A regra das transicoes fica na classe Corrida, que lanca erro se a transicao for invalida.
// A transicao e feita sobre a corrida atual da API, pois a lista exibida pode estar desatualizada.
async function mudarStatus(id, descricao, transicao) {
    const ok = await executar(descricao, async () => {
        const corrida = await buscarCorrida(id);
        transicao(corrida);
        await atualizarCorrida(id, { status: corrida.status });
    });
    if (ok) {
        await atualizar();
    }
}

function iniciarCorrida(corrida) {
    return mudarStatus(corrida.id, "Não foi possível iniciar a corrida.", (c) => c.iniciar());
}

function encerrarCorrida(corrida) {
    if (!confirm(`Deseja realmente encerrar a corrida "${corrida.nome}"? Depois de encerrada ela não aceita novos checkpoints.`)) {
        return;
    }
    return mudarStatus(corrida.id, "Não foi possível encerrar a corrida.", (c) => c.encerrar());
}

function abrirFormularioNovaCorrida() {
    titulo.textContent = "Nova corrida";
    campoId.value = "";
    campoNome.value = "";
    modal.showModal();
}

function abrirFormularioAlteracao(corrida) {
    titulo.textContent = "Alterar corrida";
    campoId.value = corrida.id;
    campoNome.value = corrida.nome;
    modal.showModal();
}

async function criarCorrida(nome) {
    const ok = await executar("Não foi possível cadastrar a corrida.", () => cadastrarCorrida(new Corrida(nome)));
    if (ok) {
        await atualizar();
    }
}

async function alterarCorrida(id, nome) {
    const ok = await executar("Não foi possível alterar a corrida.", () => atualizarCorrida(id, { nome }));
    if (ok) {
        await atualizar();
    }
}

async function excluirCorrida(id) {
    // Corrida com checkpoints nao pode ser excluida (o JSON Server nao aplica essa regra)
    const permitido = await executar("Não foi possível excluir a corrida.", async () => {
        if ((await buscarCheckpointsDaCorrida(id)).length > 0) {
            throw new Error("Não é possível excluir esta corrida porque existem checkpoints associados a ela.");
        }
    });

    if (!permitido || !confirm("Deseja realmente excluir esta corrida?")) {
        return;
    }

    if (await executar("Não foi possível excluir a corrida.", () => removerCorrida(id))) {
        await atualizar();
    }
}

export async function inicializar() {
    botaoNova.addEventListener("click", abrirFormularioNovaCorrida);

    botaoCancelar.addEventListener("click", () => modal.close());

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const id = campoId.value;
        const nome = campoNome.value.trim();
        formulario.reset();
        modal.close();

        if (!nome) {
            mostrarStatus("Informe o nome da corrida.");
            return;
        }

        if (id) {
            await alterarCorrida(id, nome);
        } else {
            await criarCorrida(nome);
        }
    });

    await atualizar();
}
