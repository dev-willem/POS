let proximoId = 1;

class Corrida {

    #id;
    #nome;
    #totalCheckpoints;
    #totalPassagens;

    constructor(nome, totalCheckpoints, totalPassagens) {
        this.#id = proximoId++;
        this.#nome = nome;
        this.#totalCheckpoints = totalCheckpoints;
        this.#totalPassagens = totalPassagens;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getTotalCheckpoints() {
        return this.#totalCheckpoints;
    }

    getTotalPassagens() {
        return this.#totalPassagens;
    }

    alterarNome(novoNome) {
        this.#nome = novoNome;
    }

    render() {
        const item = document.createElement("div");
        item.className = "corrida";
        item.dataset.id = this.#id;

        const nome = document.createElement("h3");
        nome.textContent = this.#nome;

        const checkpoints = document.createElement("p");
        checkpoints.textContent = `Checkpoints no percurso: ${this.#totalCheckpoints}`;

        const passagens = document.createElement("p");
        passagens.textContent = `Passagens registradas: ${this.#totalPassagens}`;

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.className = "botao-editar";
        botaoEditar.textContent = "Editar";
        botaoEditar.dataset.id = this.#id;

        item.appendChild(nome);
        item.appendChild(checkpoints);
        item.appendChild(passagens);
        item.appendChild(botaoEditar);

        return item;
    }
}
