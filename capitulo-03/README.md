# Capítulo 3 — Evoluindo a interação com o projeto

Recurso do projeto escolhido: **Corridas** do sistema de Controle de Checkpoints em Corridas de Trekking ([`pos-projeto-final/`](../pos-projeto-final)). Os dados usados na lista estão no mesmo formato que a API do projeto devolveria (`GET /corridas` combinado com `GET /corridas/<id>`), mas foram fixados no próprio arquivo apenas como exemplo — esta atividade não consome a API de fato.

- **Informação que pode ser alterada:** nome da corrida.
- **Classe que representa a informação:** `Corrida` (arquivo `Corrida.js`), com atributos privados (`#id`, `#nome`, `#totalCheckpoints`, `#totalPassagens`), métodos de consulta (`getId`, `getNome`, `getTotalCheckpoints`, `getTotalPassagens`) e o método `alterarNome(novoNome)`, responsável pela alteração — o mesmo dado que, na API real, é alterado por um `PUT /corridas/<id>`.
- **Evento que inicia a interação:** clique no botão "Editar" de cada corrida. O evento é registrado por delegação no container `#lista-corridas`, dentro da função `configurarEventos()`.
- **Como o objeto é localizado:** o botão de editar carrega o `id` da corrida em `dataset.id`. Ao clicar, `localizarCorrida(id)` percorre a lista com `for...of` até encontrar a instância correspondente.
- **Método que realiza a alteração:** `Corrida.alterarNome(novoNome)`, chamado ao submeter o formulário.
- **Como a interface é atualizada:** após alterar o objeto, `renderizarLista()` limpa o container e reconstrói todos os itens chamando `render()` de cada `Corrida`, já refletindo o novo nome.

## Arquivos

- `index.html` — estrutura da página e formulário de edição (inicialmente oculto).
- `style.css` — estilos visuais.
- `Corrida.js` — classe do domínio (dados + `render()`).
- `script.js` — renderização da lista, localização de objetos e configuração dos eventos.
