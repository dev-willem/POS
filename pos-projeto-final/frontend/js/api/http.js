export const URL_BASE = "http://localhost:3000";

// Erro de comunicacao com a API. A mensagem ja e legivel para o usuario.
export class ErroApi extends Error {
    constructor(mensagem, status = null) {
        super(mensagem);
        this.name = "ErroApi";
        this.status = status;
    }
}

// Unica funcao que chama o fetch. Devolve o JSON da resposta (ou null se vier vazia).
export async function requisicao(caminho, { metodo = "GET", corpo } = {}) {
    const opcoes = { method: metodo };
    if (corpo !== undefined) {
        opcoes.headers = { "Content-Type": "application/json" };
        opcoes.body = JSON.stringify(corpo);
    }

    let resposta;
    try {
        resposta = await fetch(`${URL_BASE}${caminho}`, opcoes);
    } catch {
        throw new ErroApi(`Não foi possível se comunicar com a API (${URL_BASE}). Verifique se o JSON Server está em execução.`);
    }

    if (!resposta.ok) {
        if (resposta.status === 404) {
            throw new ErroApi("O registro não foi encontrado na API (erro 404). Ele pode ter sido excluído.", 404);
        }
        throw new ErroApi(`A API respondeu com erro ${resposta.status}${resposta.statusText ? ` (${resposta.statusText})` : ""}.`, resposta.status);
    }

    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : null;
}
