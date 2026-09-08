// Recurso escolhido: Corridas do sistema de Controle de Checkpoints em Corridas
// de Trekking (pos-projeto-final). Os dados abaixo estão no mesmo formato que a
// API do projeto devolveria (GET /corridas combinado com GET /corridas/<id>),
// mas foram fixados aqui apenas como exemplo — esta atividade não consome a API.
// A edição do nome espelha o que seria um PUT /corridas/<id> real.
const corridas = [
    new Corrida("Trilha da Serra", 4, 9),
    new Corrida("Corrida das Cachoeiras", 3, 5),
    new Corrida("Desafio da Mata Atlântica", 5, 0)
];

const lista = document.getElementById("lista-corridas");
const formulario = document.getElementById("formulario-edicao");
const campoId = document.getElementById("campo-id");
const campoNome = document.getElementById("campo-nome");
const botaoCancelar = document.getElementById("botao-cancelar");

function renderizarLista() {
    lista.innerHTML = "";
    for (const corrida of corridas) {
        lista.appendChild(corrida.render());
    }
}

function localizarCorrida(id) {
    for (const corrida of corridas) {
        if (corrida.getId() === id) {
            return corrida;
        }
    }
    return null;
}

function abrirFormulario(corrida) {
    campoId.value = corrida.getId();
    campoNome.value = corrida.getNome();
    formulario.hidden = false;
}

function fecharFormulario() {
    formulario.reset();
    formulario.hidden = true;
}

function configurarEventos() {
    lista.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("botao-editar")) {
            const id = Number(evento.target.dataset.id);
            const corrida = localizarCorrida(id);
            if (corrida) {
                abrirFormulario(corrida);
            }
        }
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const id = Number(campoId.value);
        const corrida = localizarCorrida(id);

        if (corrida) {
            corrida.alterarNome(campoNome.value);
            renderizarLista();
        }

        fecharFormulario();
    });

    botaoCancelar.addEventListener("click", () => {
        fecharFormulario();
    });
}

renderizarLista();
configurarEventos();
