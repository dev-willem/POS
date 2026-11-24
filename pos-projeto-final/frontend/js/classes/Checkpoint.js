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
}
