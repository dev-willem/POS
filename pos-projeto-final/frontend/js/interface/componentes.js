import { Corrida } from "../classes/Corrida.js";

// Funcoes que constroem os elementos HTML a partir dos dados das entidades.
// Cada uma retorna o elemento criado; quem chama decide onde inseri-lo.
// As acoes recebem callbacks (aoAlterar, aoExcluir, ...) para que as regras de negocio
// continuem nos modulos de interface.

function criarBotao(texto, classe, acao, aoClicar) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("botao", classe);
    botao.dataset.acao = acao;
    botao.textContent = texto;
    botao.addEventListener("click", aoClicar);
    return botao;
}

function criarAcoes(...botoes) {
    const acoes = document.createElement("div");
    acoes.classList.add("acoes");
    acoes.append(...botoes);
    return acoes;
}

export function criarMensagemVazia(texto) {
    const vazio = document.createElement("p");
    vazio.textContent = texto;
    return vazio;
}

// Opcoes de um select: a primeira (desabilitada) serve de texto inicial
export function criarOpcoes(textoInicial, itens) {
    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.disabled = true;
    inicial.selected = true;
    inicial.textContent = textoInicial;

    const opcoes = itens.map((item) => {
        const opcao = document.createElement("option");
        opcao.value = item.id;
        opcao.textContent = item.nome;
        return opcao;
    });

    return [inicial, ...opcoes];
}

export function criarItemCorrida(corrida, totalCheckpoints, { aoIniciar, aoEncerrar, aoAlterar, aoExcluir }) {
    const item = document.createElement("div");
    item.classList.add("corrida");
    item.dataset.id = corrida.id;

    const titulo = document.createElement("h3");
    const nome = document.createElement("span");
    nome.classList.add("nome");
    nome.textContent = corrida.nome;
    const situacao = document.createElement("span");
    situacao.classList.add("badge", `badge-${corrida.status.toLowerCase()}`);
    situacao.dataset.status = corrida.status;
    situacao.textContent = corrida.status;
    titulo.append(nome, situacao);

    const checkpoints = document.createElement("p");
    checkpoints.textContent = `Checkpoints no percurso: ${totalCheckpoints}`;

    const botoes = [];
    // Apenas as acoes compativeis com o status atual
    if (corrida.status === Corrida.STATUS.CRIADA) {
        botoes.push(criarBotao("Iniciar", "botao-primario", "iniciar", () => aoIniciar(corrida)));
    } else if (corrida.status === Corrida.STATUS.INICIADA) {
        botoes.push(criarBotao("Encerrar", "botao-secundario", "encerrar", () => aoEncerrar(corrida)));
    }
    botoes.push(
        criarBotao("Alterar", "botao-secundario", "alterar", () => aoAlterar(corrida)),
        criarBotao("Excluir", "botao-perigo", "excluir", () => aoExcluir(corrida))
    );

    item.append(titulo, checkpoints, criarAcoes(...botoes));
    return item;
}

export function criarItemProfessor(professor, totalCheckpoints, { aoAlterar, aoExcluir }) {
    const item = document.createElement("div");
    item.classList.add("professor");
    item.dataset.id = professor.id;

    const titulo = document.createElement("h3");
    const nome = document.createElement("span");
    nome.classList.add("nome");
    nome.textContent = professor.nome;
    titulo.appendChild(nome);

    const checkpoints = document.createElement("p");
    checkpoints.textContent = `Checkpoints sob responsabilidade: ${totalCheckpoints}`;

    item.append(
        titulo,
        checkpoints,
        criarAcoes(
            criarBotao("Alterar", "botao-secundario", "alterar", () => aoAlterar(professor)),
            criarBotao("Excluir", "botao-perigo", "excluir", () => aoExcluir(professor))
        )
    );
    return item;
}

export function criarItemCheckpoint(checkpoint, { aoAlterar, aoExcluir }) {
    const item = document.createElement("div");
    item.classList.add("checkpoint");
    item.dataset.id = checkpoint.id;

    const titulo = document.createElement("h3");
    titulo.textContent = `Checkpoint ${checkpoint.numero}`;

    const corrida = document.createElement("p");
    corrida.textContent = `Corrida: ${checkpoint.corrida.nome}`;

    const professor = document.createElement("p");
    professor.textContent = `Responsável: ${checkpoint.professor.nome}`;

    item.append(
        titulo,
        corrida,
        professor,
        criarAcoes(
            criarBotao("Alterar", "botao-secundario", "alterar", () => aoAlterar(checkpoint)),
            criarBotao("Excluir", "botao-perigo", "excluir", () => aoExcluir(checkpoint))
        )
    );
    return item;
}
