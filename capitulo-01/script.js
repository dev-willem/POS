const simulacoes = [
    { nome: "Reserva de emergência", valorInicial: 5000, taxaMensal: 0.008, meses: 12 },
    { nome: "Viagem internacional", valorInicial: 3000, taxaMensal: 0.010, meses: 24 },
    { nome: "Aposentadoria complementar", valorInicial: 10000, taxaMensal: 0.007, meses: 60 }
];

function calcularValorFinal(valorInicial, taxaMensal, meses) {
    return valorInicial * Math.pow(1 + taxaMensal, meses);
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const lista = document.getElementById("lista-simulacoes");

for (let i = 0; i < simulacoes.length; i++) {
    const simulacao = simulacoes[i];
    const valorFinal = calcularValorFinal(simulacao.valorInicial, simulacao.taxaMensal, simulacao.meses);

    const item = document.createElement("div");
    item.className = "simulacao";

    const nome = document.createElement("h3");
    nome.textContent = simulacao.nome;

    const valorInicial = document.createElement("p");
    valorInicial.textContent = `Valor inicial: ${formatarMoeda(simulacao.valorInicial)}`;

    const taxa = document.createElement("p");
    taxa.textContent = `Taxa mensal: ${(simulacao.taxaMensal * 100).toFixed(2)}%`;

    const prazo = document.createElement("p");
    prazo.textContent = `Prazo: ${simulacao.meses} meses`;

    const resultado = document.createElement("p");
    resultado.className = "resultado";
    resultado.textContent = `Valor estimado ao final: ${formatarMoeda(valorFinal)}`;

    item.appendChild(nome);
    item.appendChild(valorInicial);
    item.appendChild(taxa);
    item.appendChild(prazo);
    item.appendChild(resultado);

    lista.appendChild(item);
}
