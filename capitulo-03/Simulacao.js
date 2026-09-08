let proximoId = 1;

class Simulacao {

    #id;
    #nome;
    #valorInicial;
    #taxaMensal;
    #meses;

    constructor(nome, valorInicial, taxaMensal, meses) {
        this.#id = proximoId++;
        this.#nome = nome;
        this.#valorInicial = valorInicial;
        this.#taxaMensal = taxaMensal;
        this.#meses = meses;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getValorInicial() {
        return this.#valorInicial;
    }

    getValorFinal() {
        return this.#valorInicial * Math.pow(1 + this.#taxaMensal, this.#meses);
    }

    alterarDados(novoNome, novoValorInicial) {
        this.#nome = novoNome;
        this.#valorInicial = novoValorInicial;
    }

    formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    render() {
        const item = document.createElement("div");
        item.className = "simulacao";
        item.dataset.id = this.#id;

        const nome = document.createElement("h3");
        nome.textContent = this.#nome;

        const valorInicial = document.createElement("p");
        valorInicial.textContent = `Valor inicial: ${this.formatarMoeda(this.#valorInicial)}`;

        const taxa = document.createElement("p");
        taxa.textContent = `Taxa mensal: ${(this.#taxaMensal * 100).toFixed(2)}%`;

        const prazo = document.createElement("p");
        prazo.textContent = `Prazo: ${this.#meses} meses`;

        const resultado = document.createElement("p");
        resultado.className = "resultado";
        resultado.textContent = `Valor estimado ao final: ${this.formatarMoeda(this.getValorFinal())}`;

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.className = "botao-editar";
        botaoEditar.textContent = "Editar";
        botaoEditar.dataset.id = this.#id;

        item.appendChild(nome);
        item.appendChild(valorInicial);
        item.appendChild(taxa);
        item.appendChild(prazo);
        item.appendChild(resultado);
        item.appendChild(botaoEditar);

        return item;
    }
}
