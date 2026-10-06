export class Corrida {
    #id;
    #nome;
    #totalCheckpoints;
    #totalPassagens;

    constructor(id, nome, totalCheckpoints = 0, totalPassagens = 0) {
        this.#id = id;
        this.#nome = nome;
        this.#totalCheckpoints = totalCheckpoints;
        this.#totalPassagens = totalPassagens;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get totalCheckpoints() {
        return this.#totalCheckpoints;
    }

    get totalPassagens() {
        return this.#totalPassagens;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    render() {
        const corrida = document.createElement("div");
        corrida.classList.add("corrida");
        corrida.dataset.id = this.#id;

        const titulo = document.createElement("h3");
        const nome = document.createElement("span");
        nome.classList.add("nome");
        nome.textContent = this.#nome;
        titulo.appendChild(nome);

        const checkpoints = document.createElement("p");
        checkpoints.textContent = `Checkpoints no percurso: ${this.#totalCheckpoints}`;

        const passagens = document.createElement("p");
        passagens.textContent = `Passagens registradas: ${this.#totalPassagens}`;

        const acoes = document.createElement("div");
        acoes.classList.add("acoes");

        const botaoAlterar = document.createElement("button");
        botaoAlterar.type = "button";
        botaoAlterar.classList.add("botao", "botao-secundario");
        botaoAlterar.dataset.acao = "alterar";
        botaoAlterar.textContent = "Alterar";

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.classList.add("botao", "botao-perigo");
        botaoExcluir.dataset.acao = "excluir";
        botaoExcluir.textContent = "Excluir";

        acoes.append(botaoAlterar, botaoExcluir);
        corrida.append(titulo, checkpoints, passagens, acoes);

        return corrida;
    }
}
