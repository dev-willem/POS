const simulacoes = [
    new Simulacao("Reserva de emergência", 5000, 0.008, 12),
    new Simulacao("Viagem internacional", 3000, 0.010, 24),
    new Simulacao("Aposentadoria complementar", 10000, 0.007, 60)
];

const lista = document.getElementById("lista-simulacoes");

for (const simulacao of simulacoes) {
    lista.appendChild(simulacao.render());
}
