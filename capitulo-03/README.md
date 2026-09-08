# Capítulo 3 — Evoluindo a interação com o projeto

Recurso do projeto escolhido: **lista de simulações de investimento**, do projeto de simulações de investimentos e financiamentos.

- **Informação que pode ser alterada:** nome e valor inicial de uma simulação.
- **Classe que representa a informação:** `Simulacao` (arquivo `Simulacao.js`), com atributos privados (`#id`, `#nome`, `#valorInicial`, `#taxaMensal`, `#meses`), métodos de consulta (`getId`, `getNome`, `getValorInicial`, `getValorFinal`) e o método `alterarDados(novoNome, novoValorInicial)`, responsável pela alteração.
- **Evento que inicia a interação:** clique no botão "Editar" de cada simulação. O evento é registrado por delegação no container `#lista-simulacoes`, dentro da função `configurarEventos()`.
- **Como o objeto é localizado:** o botão de editar carrega o `id` da simulação em `dataset.id`. Ao clicar, `localizarSimulacao(id)` percorre a lista com `for...of` até encontrar a instância correspondente.
- **Método que realiza a alteração:** `Simulacao.alterarDados(novoNome, novoValorInicial)`, chamado ao submeter o formulário.
- **Como a interface é atualizada:** após alterar o objeto, `renderizarLista()` limpa o container e reconstrói todos os itens chamando `render()` de cada `Simulacao`, já refletindo o novo nome, o novo valor inicial e o valor final recalculado.

## Arquivos

- `index.html` — estrutura da página e formulário de edição (inicialmente oculto).
- `style.css` — estilos visuais.
- `Simulacao.js` — classe do domínio (dados + `render()`).
- `script.js` — renderização da lista, localização de objetos e configuração dos eventos.
