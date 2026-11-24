import { professores, salvarProfessores } from "../dados/professores.js";
import { checkpoints } from "../dados/checkpoints.js";
import { Professor } from "../classes/Professor.js";
import { criarItemProfessor, criarMensagemVazia } from "./componentes.js";

const lista = document.querySelector("#lista-professores");
const status = document.querySelector("#status");
const botaoNova = document.querySelector("#nova-professor");
const modal = document.querySelector("#modal-professor");
const formulario = document.querySelector("#form-professor");
const titulo = document.querySelector("#titulo-formulario");
const campoId = document.querySelector("#professor-id");
const campoNome = document.querySelector("#professor-nome");
const botaoCancelar = document.querySelector("#cancelar-professor");

function mostrarStatus(mensagem) {
    status.textContent = mensagem;
    status.hidden = false;
}

function limparStatus() {
    status.textContent = "";
    status.hidden = true;
}

function renderizarProfessores() {
    lista.innerHTML = "";

    if (professores.length === 0) {
        lista.appendChild(criarMensagemVazia("Nenhum professor cadastrado."));
        return;
    }

    for (const professor of professores) {
        const total = checkpoints.filter((c) => c.professor.id === professor.id).length;

        lista.appendChild(criarItemProfessor(professor, total, {
            aoAlterar: abrirFormularioAlteracao,
            aoExcluir: (p) => excluirProfessor(p.id)
        }));
    }
}

function abrirFormularioNovoProfessor() {
    titulo.textContent = "Novo professor";
    campoId.value = "";
    campoNome.value = "";
    modal.showModal();
}

function abrirFormularioAlteracao(professor) {
    titulo.textContent = "Alterar professor";
    campoId.value = professor.id;
    campoNome.value = professor.nome;
    modal.showModal();
}

function criarProfessor(nome) {
    professores.push(new Professor(nome));
    salvarProfessores();
    renderizarProfessores();
    limparStatus();
}

function alterarProfessor(id, nome) {
    const professor = professores.find((c) => c.id === Number(id));
    professor.nome = nome;
    salvarProfessores();
    renderizarProfessores();
    limparStatus();
}

function excluirProfessor(id) {
    // Professor com checkpoints nao pode ser excluido
    if (checkpoints.some((c) => c.professor.id == id)) {
        mostrarStatus("Não é possível excluir este professor porque ele é responsável por checkpoints.");
        return;
    }

    if (!confirm("Deseja realmente excluir este professor?")) {
        return;
    }

    const indice = professores.findIndex((c) => c.id === id);
    professores.splice(indice, 1);
    salvarProfessores();
    renderizarProfessores();
    limparStatus();
}

export function inicializar() {
    botaoNova.addEventListener("click", abrirFormularioNovoProfessor);

    botaoCancelar.addEventListener("click", () => modal.close());

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nome = campoNome.value.trim();

        if (campoId.value) {
            alterarProfessor(campoId.value, nome);
        } else {
            criarProfessor(nome);
        }
        formulario.reset();
        modal.close();
    });

    renderizarProfessores();
}
