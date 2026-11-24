export class Professor {
    #id;
    #nome;

    // O id e gerado pela API; fica null enquanto o professor ainda nao foi salvo
    constructor(nome, id = null) {
        this.#id = id;
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
}
