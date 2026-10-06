export class Professor {
    static proximoId = 1;

    #id;
    #nome;

    constructor(nome, id = null) {
        if (id === null) {
            this.#id = Professor.proximoId++;
        } else {
            this.#id = id;
            Professor.proximoId = Math.max(Professor.proximoId, id + 1);
        }
        this.#nome = nome;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    render(totalCheckpoints = 0) {
        const professor = document.createElement("div");
        professor.classList.add("professor");
        professor.dataset.id = this.#id;

        const titulo = document.createElement("h3");
        const nome = document.createElement("span");
        nome.classList.add("nome");
        nome.textContent = this.#nome;
        titulo.appendChild(nome);

        const checkpoints = document.createElement("p");
        checkpoints.textContent = `Checkpoints sob responsabilidade: ${totalCheckpoints}`;

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
        professor.append(titulo, checkpoints, acoes);

        return professor;
    }
}
