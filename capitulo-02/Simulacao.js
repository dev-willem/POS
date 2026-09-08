class Simulacao {

    #nome;
    #valorInicial;
    #taxaMensal;
    #meses;

    constructor(nome, valorInicial, taxaMensal, meses) {
        this.#nome = nome;
        this.#valorInicial = valorInicial;
        this.#taxaMensal = taxaMensal;
        this.#meses = meses;
    }

    getValorFinal() {
        return this.#valorInicial * Math.pow(1 + this.#taxaMensal, this.#meses);
    }

    formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    render() {
        const item = document.createElement("div");
        item.className = "simulacao";

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

        item.appendChild(nome);
        item.appendChild(valorInicial);
        item.appendChild(taxa);
        item.appendChild(prazo);
        item.appendChild(resultado);

        return item;
    }
}
