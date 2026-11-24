import { carregarDados } from "../api/dados.js";
import { atualizarProfessor, cadastrarProfessor, removerProfessor } from "../api/professores.js";
import { buscarCheckpointsDoProfessor } from "../api/checkpoints.js";
import { mesmoId } from "../api/id.js";
import { Professor } from "../classes/Professor.js";
import { criarItemProfessor, criarMensagemVazia } from "./componentes.js";
import { executar, limparStatus, mostrarStatus } from "./mensagens.js";

const lista = document.querySelector("#lista-professores");
const botaoNova = document.querySelector("#nova-professor");
const modal = document.querySelector("#modal-professor");
const formulario = document.querySelector("#form-professor");
const titulo = document.querySelector("#titulo-formulario");
const campoId = document.querySelector("#professor-id");
const campoNome = document.querySelector("#professor-nome");
const botaoCancelar = document.querySelector("#cancelar-professor");

let professores = [];
let checkpoints = [];

// Busca os dados na API e redesenha a lista
async function atualizar() {
    try {
        ({ professores, checkpoints } = await carregarDados());
    } catch (erro) {
        mostrarStatus(`Não foi possível carregar os professores. ${erro.message}`);
        return;
    }
    limparStatus();
    renderizarProfessores();
}

function renderizarProfessores() {
    lista.innerHTML = "";

    if (professores.length === 0) {
        lista.appendChild(criarMensagemVazia("Nenhum professor cadastrado."));
        return;
    }

    for (const professor of professores) {
        const total = checkpoints.filter((c) => mesmoId(c.professor.id, professor.id)).length;

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

async function criarProfessor(nome) {
    const ok = await executar("Não foi possível cadastrar o professor.", () => cadastrarProfessor(new Professor(nome)));
    if (ok) {
        await atualizar();
    }
}

async function alterarProfessor(id, nome) {
    const ok = await executar("Não foi possível alterar o professor.", () => atualizarProfessor(id, { nome }));
    if (ok) {
        await atualizar();
    }
}

async function excluirProfessor(id) {
    // Professor com checkpoints nao pode ser excluido (o JSON Server nao aplica essa regra)
    const permitido = await executar("Não foi possível excluir o professor.", async () => {
        if ((await buscarCheckpointsDoProfessor(id)).length > 0) {
            throw new Error("Não é possível excluir este professor porque ele é responsável por checkpoints.");
        }
    });

    if (!permitido || !confirm("Deseja realmente excluir este professor?")) {
        return;
    }

    if (await executar("Não foi possível excluir o professor.", () => removerProfessor(id))) {
        await atualizar();
    }
}

export async function inicializar() {
    botaoNova.addEventListener("click", abrirFormularioNovoProfessor);

    botaoCancelar.addEventListener("click", () => modal.close());

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const id = campoId.value;
        const nome = campoNome.value.trim();
        formulario.reset();
        modal.close();

        if (!nome) {
            mostrarStatus("Informe o nome do professor.");
            return;
        }

        if (id) {
            await alterarProfessor(id, nome);
        } else {
            await criarProfessor(nome);
        }
    });

    await atualizar();
}
