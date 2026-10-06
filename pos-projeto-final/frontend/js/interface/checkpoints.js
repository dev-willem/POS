import { checkpoints, salvarCheckpoints } from "../dados/checkpoints.js";
import { corridas } from "../dados/corridas.js";
import { professores } from "../dados/professores.js";
import { Checkpoint } from "../classes/Checkpoint.js";

const lista = document.querySelector("#lista-checkpoints");
const status = document.querySelector("#status");
const botaoNovo = document.querySelector("#novo-checkpoint");
const modal = document.querySelector("#modal-checkpoint");
const formulario = document.querySelector("#form-checkpoint");
const titulo = document.querySelector("#titulo-formulario");
const campoId = document.querySelector("#checkpoint-id");
const campoNumero = document.querySelector("#checkpoint-numero");
const campoCorrida = document.querySelector("#checkpoint-corrida");
const campoProfessor = document.querySelector("#checkpoint-professor");
const botaoCancelar = document.querySelector("#cancelar-checkpoint");

function mostrarStatus(mensagem) {
    status.textContent = mensagem;
    status.hidden = false;
}

function limparStatus() {
    status.textContent = "";
    status.hidden = true;
}

function criarCheckpoints() {
    lista.innerHTML = "";

    if (checkpoints.length === 0) {
        const vazio = document.createElement("p");
        vazio.textContent = "Nenhum checkpoint cadastrado.";
        lista.appendChild(vazio);
        return;
    }

    // Ordena por corrida e numero
    const ordenados = [...checkpoints].sort((a, b) =>
        a.corrida.nome.localeCompare(b.corrida.nome) || a.numero - b.numero
    );

    for (const checkpoint of ordenados) {
        const item = checkpoint.render();

        const botaoAlterar = item.querySelector('[data-acao="alterar"]');
        const botaoExcluir = item.querySelector('[data-acao="excluir"]');

        botaoAlterar.addEventListener("click", () => abrirFormularioAlteracao(checkpoint));
        botaoExcluir.addEventListener("click", () => excluirCheckpoint(checkpoint.id));

        lista.appendChild(item);
    }
}

function preencherSelect(select, textoInicial, itens) {
    select.innerHTML = "";

    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.disabled = true;
    inicial.selected = true;
    inicial.textContent = textoInicial;
    select.appendChild(inicial);

    for (const item of itens) {
        const opcao = document.createElement("option");
        opcao.value = item.id;
        opcao.textContent = item.nome;
        select.appendChild(opcao);
    }
}

function abrirFormularioNovoCheckpoint() {
    if (corridas.length === 0 || professores.length === 0) {
        mostrarStatus("Cadastre ao menos uma corrida (página Corridas) e um professor (página Professores) antes de criar um checkpoint.");
        return;
    }

    limparStatus();
    titulo.textContent = "Novo checkpoint";
    campoId.value = "";
    campoNumero.value = "";
    preencherSelect(campoCorrida, "Selecione a corrida", corridas);
    preencherSelect(campoProfessor, "Selecione o professor", professores);
    modal.showModal();
}

function abrirFormularioAlteracao(checkpoint) {
    limparStatus();
    titulo.textContent = "Alterar checkpoint";
    campoId.value = checkpoint.id;
    campoNumero.value = checkpoint.numero;
    preencherSelect(campoCorrida, "Selecione a corrida", corridas);
    preencherSelect(campoProfessor, "Selecione o professor", professores);
    campoCorrida.value = checkpoint.corrida.id;
    campoProfessor.value = checkpoint.professor.id;
    modal.showModal();
}

// Numero nao pode se repetir na mesma corrida
function numeroJaExiste(numero, corrida, idIgnorado) {
    return checkpoints.some((c) =>
        c.corrida.id === corrida.id && c.numero === numero && c.id !== idIgnorado
    );
}

function criarCheckpoint(numero, corrida, professor) {
    if (numeroJaExiste(numero, corrida, null)) {
        mostrarStatus(`Já existe o checkpoint ${numero} na corrida "${corrida.nome}".`);
        return false;
    }

    checkpoints.push(new Checkpoint(numero, corrida, professor));
    salvarCheckpoints();
    criarCheckpoints();
    limparStatus();
    return true;
}

function alterarCheckpoint(id, numero, corrida, professor) {
    const checkpoint = checkpoints.find((c) => c.id === Number(id));

    if (numeroJaExiste(numero, corrida, checkpoint.id)) {
        mostrarStatus(`Já existe o checkpoint ${numero} na corrida "${corrida.nome}".`);
        return false;
    }

    checkpoint.numero = numero;
    checkpoint.corrida = corrida;
    checkpoint.professor = professor;
    salvarCheckpoints();
    criarCheckpoints();
    limparStatus();
    return true;
}

function excluirCheckpoint(id) {
    if (!confirm("Deseja realmente excluir este checkpoint?")) {
        return;
    }

    const indice = checkpoints.findIndex((c) => c.id === id);
    checkpoints.splice(indice, 1);
    salvarCheckpoints();
    criarCheckpoints();
    limparStatus();
}

export function inicializar() {
    botaoNovo.addEventListener("click", abrirFormularioNovoCheckpoint);

    botaoCancelar.addEventListener("click", () => modal.close());

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const numero = Number(campoNumero.value);
        const corrida = corridas.find((c) => c.id === Number(campoCorrida.value));
        const professor = professores.find((p) => p.id === Number(campoProfessor.value));

        if (campoId.value) {
            alterarCheckpoint(campoId.value, numero, corrida, professor);
        } else {
            criarCheckpoint(numero, corrida, professor);
        }
        formulario.reset();
        modal.close();
    });

    criarCheckpoints();
}
