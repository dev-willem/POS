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
}
