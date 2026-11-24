export class Corrida {
    static STATUS = Object.freeze({
        CRIADA: "Criada",
        INICIADA: "Iniciada",
        ENCERRADA: "Encerrada"
    });

    static proximoId = 1;

    #id;
    #nome;
    #status;

    constructor(nome, id = null, status = Corrida.STATUS.CRIADA) {
        if (!Object.values(Corrida.STATUS).includes(status)) {
            throw new Error(`Status de corrida inválido: "${status}".`);
        }
        if (id === null) {
            this.#id = Corrida.proximoId++;
        } else {
            this.#id = id;
            Corrida.proximoId = Math.max(Corrida.proximoId, id + 1);
        }
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

    render(totalCheckpoints = 0) {
        const corrida = document.createElement("div");
        corrida.classList.add("corrida");
        corrida.dataset.id = this.#id;

        const titulo = document.createElement("h3");
        const nome = document.createElement("span");
        nome.classList.add("nome");
        nome.textContent = this.#nome;
        const situacao = document.createElement("span");
        situacao.classList.add("badge", `badge-${this.#status.toLowerCase()}`);
        situacao.dataset.status = this.#status;
        situacao.textContent = this.#status;
        titulo.append(nome, situacao);

        const checkpoints = document.createElement("p");
        checkpoints.textContent = `Checkpoints no percurso: ${totalCheckpoints}`;

        const acoes = document.createElement("div");
        acoes.classList.add("acoes");

        // Apenas as acoes compativeis com o status atual
        if (this.#status === Corrida.STATUS.CRIADA) {
            const botaoIniciar = document.createElement("button");
            botaoIniciar.type = "button";
            botaoIniciar.classList.add("botao", "botao-primario");
            botaoIniciar.dataset.acao = "iniciar";
            botaoIniciar.textContent = "Iniciar";
            acoes.appendChild(botaoIniciar);
        } else if (this.#status === Corrida.STATUS.INICIADA) {
            const botaoEncerrar = document.createElement("button");
            botaoEncerrar.type = "button";
            botaoEncerrar.classList.add("botao", "botao-secundario");
            botaoEncerrar.dataset.acao = "encerrar";
            botaoEncerrar.textContent = "Encerrar";
            acoes.appendChild(botaoEncerrar);
        }

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
        corrida.append(titulo, checkpoints, acoes);

        return corrida;
    }
}
