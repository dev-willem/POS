class Corrida {

    #nome;
    #totalCheckpoints;
    #totalPassagens;

    constructor(nome, totalCheckpoints, totalPassagens) {
        this.#nome = nome;
        this.#totalCheckpoints = totalCheckpoints;
        this.#totalPassagens = totalPassagens;
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

    render() {
        const item = document.createElement("div");
        item.className = "corrida";

        const nome = document.createElement("h3");
        nome.textContent = this.#nome;

        const checkpoints = document.createElement("p");
        checkpoints.textContent = `Checkpoints no percurso: ${this.#totalCheckpoints}`;

        const passagens = document.createElement("p");
        passagens.textContent = `Passagens registradas: ${this.#totalPassagens}`;

        item.appendChild(nome);
        item.appendChild(checkpoints);
        item.appendChild(passagens);

        return item;
    }
}
