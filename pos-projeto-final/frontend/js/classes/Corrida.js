export class Corrida {
    static STATUS = Object.freeze({
        CRIADA: "Criada",
        INICIADA: "Iniciada",
        ENCERRADA: "Encerrada"
    });

    #id;
    #nome;
    #status;

    // O id e gerado pela API; fica null enquanto a corrida ainda nao foi salva
    constructor(nome, id = null, status = Corrida.STATUS.CRIADA) {
        if (!Object.values(Corrida.STATUS).includes(status)) {
            throw new Error(`Status de corrida inválido: "${status}".`);
        }
        this.#id = id;
        this.#nome = nome;
        this.#status = status;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get status() {
        return this.#status;
    }

    // Somente corridas iniciadas recebem novos registros de checkpoint
    get aceitaCheckpoints() {
        return this.#status === Corrida.STATUS.INICIADA;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    // Criada -> Iniciada
    iniciar() {
        if (this.#status !== Corrida.STATUS.CRIADA) {
            throw new Error(`Só é possível iniciar uma corrida com status "${Corrida.STATUS.CRIADA}". Status atual: "${this.#status}".`);
        }
        this.#status = Corrida.STATUS.INICIADA;
    }

    // Iniciada -> Encerrada
    encerrar() {
        if (this.#status !== Corrida.STATUS.INICIADA) {
            throw new Error(`Só é possível encerrar uma corrida com status "${Corrida.STATUS.INICIADA}". Status atual: "${this.#status}".`);
        }
        this.#status = Corrida.STATUS.ENCERRADA;
    }
}
