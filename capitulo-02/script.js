// Recurso escolhido: Corridas do sistema de Controle de Checkpoints em Corridas
// de Trekking (pos-projeto-final). Os dados abaixo estão no mesmo formato que a
// API do projeto devolveria (GET /corridas combinado com GET /corridas/<id>),
// mas foram fixados aqui apenas como exemplo — esta atividade não consome a API.
const corridas = [
    new Corrida("Trilha da Serra", 4, 9),
    new Corrida("Corrida das Cachoeiras", 3, 5),
    new Corrida("Desafio da Mata Atlântica", 5, 0)
];

const lista = document.getElementById("lista-corridas");

for (const corrida of corridas) {
    lista.appendChild(corrida.render());
}
