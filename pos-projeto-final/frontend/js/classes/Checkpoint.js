export class Checkpoint {
    #id;
    #numero;
    #corrida;
    #professor;

    // O id e gerado pela API; fica null enquanto o checkpoint ainda nao foi salvo
    constructor(numero, corrida, professor, id = null) {
        this.#id = id;
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
}
