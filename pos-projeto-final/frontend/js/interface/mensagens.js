import { ErroApi } from "../api/http.js";

const status = document.querySelector("#status");

export function mostrarStatus(mensagem) {
    status.textContent = mensagem;
    status.hidden = false;
}

export function limparStatus() {
    status.textContent = "";
    status.hidden = true;
}

// Executa uma operacao assincrona. Se falhar, mostra a mensagem na tela e devolve false.
// Erros da API ganham o contexto da operacao; os demais (regras de negocio) ja trazem a mensagem.
export async function executar(descricao, operacao) {
    try {
        await operacao();
        return true;
    } catch (erro) {
        mostrarStatus(erro instanceof ErroApi ? `${descricao} ${erro.message}` : erro.message);
        return false;
    }
}
