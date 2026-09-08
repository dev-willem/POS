const simulacoes = [
    new Simulacao("Reserva de emergência", 5000, 0.008, 12),
    new Simulacao("Viagem internacional", 3000, 0.010, 24),
    new Simulacao("Aposentadoria complementar", 10000, 0.007, 60)
];

const lista = document.getElementById("lista-simulacoes");
const formulario = document.getElementById("formulario-edicao");
const campoId = document.getElementById("campo-id");
const campoNome = document.getElementById("campo-nome");
const campoValorInicial = document.getElementById("campo-valor-inicial");
const botaoCancelar = document.getElementById("botao-cancelar");

function renderizarLista() {
    lista.innerHTML = "";
    for (const simulacao of simulacoes) {
        lista.appendChild(simulacao.render());
    }
}

function localizarSimulacao(id) {
    for (const simulacao of simulacoes) {
        if (simulacao.getId() === id) {
            return simulacao;
        }
    }
    return null;
}

function abrirFormulario(simulacao) {
    campoId.value = simulacao.getId();
    campoNome.value = simulacao.getNome();
    campoValorInicial.value = simulacao.getValorInicial();
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
            const simulacao = localizarSimulacao(id);
            if (simulacao) {
                abrirFormulario(simulacao);
            }
        }
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const id = Number(campoId.value);
        const simulacao = localizarSimulacao(id);

        if (simulacao) {
            simulacao.alterarDados(campoNome.value, Number(campoValorInicial.value));
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
