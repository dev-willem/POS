async function requisitar(url, opcoes = {}) {
    const resposta = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...opcoes,
    });

    let corpo = null;
    try {
        corpo = await resposta.json();
    } catch {
        corpo = null;
    }

    if (!resposta.ok) {
        throw new Error(corpo?.erro ?? "Erro ao comunicar com a API.");
    }

    return corpo;
}

export async function listarCorridas() {
    return await requisitar("/corridas");
}

export async function cadastrarCorrida(nome) {
    return await requisitar("/corridas", {
        method: "POST",
        body: JSON.stringify({ nome }),
    });
}

export async function atualizarCorrida(id, nome) {
    return await requisitar(`/corridas/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nome }),
    });
}

export async function removerCorrida(id) {
    await requisitar(`/corridas/${id}`, { method: "DELETE" });
}
