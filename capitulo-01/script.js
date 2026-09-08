// Recurso escolhido: Corridas do sistema de Controle de Checkpoints em Corridas
// de Trekking (pos-projeto-final). Os dados abaixo estão no mesmo formato que a
// API do projeto devolveria (GET /corridas combinado com GET /corridas/<id>),
// mas foram fixados aqui apenas como exemplo — esta atividade não consome a API.
const corridas = [
    { nome: "Trilha da Serra", totalCheckpoints: 4, totalPassagens: 9 },
    { nome: "Corrida das Cachoeiras", totalCheckpoints: 3, totalPassagens: 5 },
    { nome: "Desafio da Mata Atlântica", totalCheckpoints: 5, totalPassagens: 0 }
];

const lista = document.getElementById("lista-corridas");

for (let i = 0; i < corridas.length; i++) {
    const corrida = corridas[i];

    const item = document.createElement("div");
    item.className = "corrida";

    const nome = document.createElement("h3");
    nome.textContent = corrida.nome;

    const checkpoints = document.createElement("p");
    checkpoints.textContent = `Checkpoints no percurso: ${corrida.totalCheckpoints}`;

    const passagens = document.createElement("p");
    passagens.textContent = `Passagens registradas: ${corrida.totalPassagens}`;

    item.appendChild(nome);
    item.appendChild(checkpoints);
    item.appendChild(passagens);

    lista.appendChild(item);
}
