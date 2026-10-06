import { corridas, criarObjetoCorrida, carregarCorridas } from "../dados/corridas.js";
import { cadastrarCorrida, atualizarCorrida, removerCorrida } from "../servicos/api.js";

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

function criarCorridas() {
    lista.innerHTML = "";

    if (corridas.length === 0) {
        const vazio = document.createElement("p");
        vazio.textContent = "Nenhuma corrida cadastrada.";
        lista.appendChild(vazio);
        return;
    }

    for (const corrida of corridas) {
        const item = corrida.render();

        const botaoAlterar = item.querySelector('[data-acao="alterar"]');
        const botaoExcluir = item.querySelector('[data-acao="excluir"]');

        if (botaoAlterar) {
            botaoAlterar.addEventListener("click", () => abrirFormularioAlteracao(corrida));
        }
        if (botaoExcluir) {
            botaoExcluir.addEventListener("click", () => excluirCorrida(corrida.id));
        }

        lista.appendChild(item);
    }
}

function abrirFormularioCriacao() {
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
    try {
        const resposta = await cadastrarCorrida(nome);
        corridas.push(criarObjetoCorrida(resposta));
        criarCorridas();
        limparStatus();
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function alterarCorrida(id, nome) {
    try {
        const resposta = await atualizarCorrida(id, nome);
        const corrida = corridas.find((c) => c.id === Number(id));
        corrida.nome = resposta.nome;

        // Atualiza apenas o texto do nome no cartao, sem redesenhar a lista
        const nomeNoCartao = lista.querySelector(`.corrida[data-id="${id}"] .nome`);
        nomeNoCartao.textContent = corrida.nome;
        limparStatus();
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function excluirCorrida(id) {
    if (!confirm("Deseja realmente excluir esta corrida?")) {
        return;
    }

    try {
        await removerCorrida(id);
        const indice = corridas.findIndex((c) => c.id === id);
        corridas.splice(indice, 1);
        criarCorridas();
        limparStatus();
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

botaoNova.addEventListener("click", abrirFormularioCriacao);

botaoCancelar.addEventListener("click", () => modal.close());

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = campoNome.value.trim();

    if (campoId.value) {
        await alterarCorrida(campoId.value, nome);
    } else {
        await criarCorrida(nome);
    }
    modal.close();
});

export async function iniciarCorridas() {
    try {
        await carregarCorridas();
        criarCorridas();
    } catch (erro) {
        mostrarStatus("Não foi possível carregar as corridas. Verifique se a API está em execução.");
    }
}
