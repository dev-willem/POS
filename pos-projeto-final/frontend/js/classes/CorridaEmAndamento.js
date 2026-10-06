import { Corrida } from "./Corrida.js";

export class CorridaEmAndamento extends Corrida {
    // Ja possui passagens registradas, entao nao pode ser excluida:
    // o render() oferece apenas o botao "Alterar".
    render() {
        const corrida = document.createElement("div");
        corrida.classList.add("corrida", "corrida-em-andamento");
        corrida.dataset.id = this.id;

        const titulo = document.createElement("h3");
        const nome = document.createElement("span");
        nome.classList.add("nome");
        nome.textContent = this.nome;
        const selo = document.createElement("span");
        selo.classList.add("selo");
        selo.textContent = "Em andamento";
        titulo.append(nome, selo);

        const checkpoints = document.createElement("p");
        checkpoints.textContent = `Checkpoints no percurso: ${this.totalCheckpoints}`;

        const passagens = document.createElement("p");
        passagens.textContent = `Passagens registradas: ${this.totalPassagens}`;

        const acoes = document.createElement("div");
        acoes.classList.add("acoes");

        const botaoAlterar = document.createElement("button");
        botaoAlterar.type = "button";
        botaoAlterar.classList.add("botao", "botao-secundario");
        botaoAlterar.dataset.acao = "alterar";
        botaoAlterar.textContent = "Alterar";

        acoes.appendChild(botaoAlterar);
        corrida.append(titulo, checkpoints, passagens, acoes);

        return corrida;
    }
}
