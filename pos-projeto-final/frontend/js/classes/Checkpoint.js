export class Checkpoint {
    static proximoId = 1;

    #id;
    #numero;
    #corrida;
    #professor;

    constructor(numero, corrida, professor, id = null) {
        if (id === null) {
            this.#id = Checkpoint.proximoId++;
        } else {
            this.#id = id;
            Checkpoint.proximoId = Math.max(Checkpoint.proximoId, id + 1);
        }
        this.#numero = numero;
        this.#corrida = corrida;
        this.#professor = professor;
    }

    get id() {
        return this.#id;
    }

    get numero() {
        return this.#numero;
    }

    get corrida() {
        return this.#corrida;
    }

    get professor() {
        return this.#professor;
    }

    set numero(novoNumero) {
        this.#numero = novoNumero;
    }

    set corrida(novaCorrida) {
        this.#corrida = novaCorrida;
    }

    set professor(novoProfessor) {
        this.#professor = novoProfessor;
    }

    render() {
        const checkpoint = document.createElement("div");
        checkpoint.classList.add("checkpoint");
        checkpoint.dataset.id = this.#id;

        const titulo = document.createElement("h3");
        titulo.textContent = `Checkpoint ${this.#numero}`;

        const corrida = document.createElement("p");
        corrida.textContent = `Corrida: ${this.#corrida.nome}`;

        const professor = document.createElement("p");
        professor.textContent = `Responsável: ${this.#professor.nome}`;

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
        checkpoint.append(titulo, corrida, professor, acoes);

        return checkpoint;
    }
}
