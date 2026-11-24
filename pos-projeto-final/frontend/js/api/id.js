// Os ids vem da API e o JSON Server gera ids textuais: nunca converter para numero.
// Todas as comparacoes de id (inclusive com o value de um select) usam este criterio.
export function mesmoId(a, b) {
    return String(a) === String(b);
}

// Para montar caminhos de URL com qualquer id
export function caminhoDoId(id) {
    return encodeURIComponent(id);
}
