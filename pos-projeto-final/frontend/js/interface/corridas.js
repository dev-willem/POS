import { corridas, salvarCorridas } from "../dados/corridas.js";
import { checkpoints } from "../dados/checkpoints.js";
import { Corrida } from "../classes/Corrida.js";
import { criarItemCorrida, criarMensagemVazia } from "./componentes.js";

const lista = document.querySelector("#lista-corridas");
const status = document.querySelector("#status");
const botaoNova = document.querySelector("#nova-corrida");
const modal = document.querySelector("#modal-corrida");
const formulario = document.querySelector("#form-corrida");
const titulo = document.querySelector("#titulo-formulario");
const campoId = document.querySelector("#corrida-id");
const campoNome = document.querySelector("#corrida-nome");
const botaoCancelar = document.querySelector("#cancelar-corrida");

function mostrarStatus(mensagem) {
    status.textContent = mensagem;
    status.hidden = false;
}

function limparStatus() {
    status.textContent = "";
    status.hidden = true;
}

function renderizarCorridas() {
    lista.innerHTML = "";

    if (corridas.length === 0) {
        lista.appendChild(criarMensagemVazia("Nenhuma corrida cadastrada."));
        return;
    }

    for (const corrida of corridas) {
        const total = checkpoints.filter((c) => c.corrida.id === corrida.id).length;

        lista.appendChild(criarItemCorrida(corrida, total, {
            aoIniciar: iniciarCorrida,
            aoEncerrar: encerrarCorrida,
            aoAlterar: abrirFormularioAlteracao,
            aoExcluir: (c) => excluirCorrida(c.id)
        }));
    }
}

// A regra das transicoes fica na classe Corrida, que lanca erro se a transicao for invalida
function mudarStatus(transicao) {
    try {
        transicao();
    } catch (erro) {
        mostrarStatus(erro.message);
        return;
    }
    salvarCorridas();
    renderizarCorridas();
    limparStatus();
}

function iniciarCorrida(corrida) {
    mudarStatus(() => corrida.iniciar());
}

function encerrarCorrida(corrida) {
    if (!confirm(`Deseja realmente encerrar a corrida "${corrida.nome}"? Depois de encerrada ela não aceita novos checkpoints.`)) {
        return;
    }
    mudarStatus(() => corrida.encerrar());
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

function criarCorrida(nome) {
    corridas.push(new Corrida(nome));
    salvarCorridas();
    renderizarCorridas();
    limparStatus();
}

function alterarCorrida(id, nome) {
    const corrida = corridas.find((c) => c.id === Number(id));
    corrida.nome = nome;
    salvarCorridas();
    renderizarCorridas();
    limparStatus();
}

function excluirCorrida(id) {
    // Corrida com checkpoints nao pode ser excluida
    if (checkpoints.some((c) => c.corrida.id == id)) {
        mostrarStatus("Não é possível excluir esta corrida porque existem checkpoints associados a ela.");
        return;
    }

    if (!confirm("Deseja realmente excluir esta corrida?")) {
        return;
    }

    const indice = corridas.findIndex((c) => c.id === id);
    corridas.splice(indice, 1);
    salvarCorridas();
    renderizarCorridas();
    limparStatus();
}

export function inicializar() {
    botaoNova.addEventListener("click", abrirFormularioNovaCorrida);

    botaoCancelar.addEventListener("click", () => modal.close());

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nome = campoNome.value.trim();

        if (campoId.value) {
            alterarCorrida(campoId.value, nome);
        } else {
            criarCorrida(nome);
        }
        formulario.reset();
        modal.close();
    });

    renderizarCorridas();
}
