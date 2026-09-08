# POS

Repositório com os trabalhos da pós-graduação, organizados por disciplina.

## Exercícios de JavaScript (capítulos 1 a 3)

Exercícios de fixação de JavaScript aplicados ao recurso **Corridas** do projeto [`pos-projeto-final/`](pos-projeto-final) (sistema de Controle de Checkpoints em Corridas de Trekking). Os dados usados são exemplos estáticos no formato que a API do projeto devolveria — nenhum dos capítulos consome a API de fato. Cada capítulo evolui a mesma lista de corridas.

- [`capitulo-01/`](capitulo-01) — JavaScript na Página Web: lista de corridas representada por objetos simples, renderizada dinamicamente no DOM.
- [`capitulo-02/`](capitulo-02) — Objetos e Classes em JavaScript: a mesma lista reescrita com a classe `Corrida` (atributos privados, métodos, `render()`).
- [`capitulo-03/`](capitulo-03) — Eventos e Interação com a Interface: formulário para editar o nome de uma corrida, com eventos, `data-*` e sincronização entre objeto e interface (detalhes no README da pasta).

Cada pasta é independente: 1 `index.html`, 1 `style.css` e os arquivos JavaScript necessários. Basta abrir o `index.html` da pasta desejada no navegador.

## Projeto final — Programação Orientada a Serviços

- [`pos-projeto-final/`](pos-projeto-final) — Atividade 1 (Análise, Modelagem, Prototipação e Primeira Implementação) do estudo de caso **Controle de Checkpoints em Corridas de Trekking**: documentação (requisitos, casos de uso, DER, protótipo) em `docs/relatorio.pdf` e a primeira versão da API em Flask + SQLite (detalhes no README da pasta).
