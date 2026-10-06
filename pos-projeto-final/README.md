# Sistema de Controle de Checkpoints em Corridas de Trekking

Atividade 1 (Análise, Modelagem, Prototipação e Primeira Implementação) da disciplina Programação Orientada a Serviços — Estudo de Caso 3: Controle de Checkpoints em Corridas de Trekking.

A documentação completa (introdução, requisitos, diagrama de casos de uso, DER e protótipo visual) está em [`docs/relatorio.pdf`](docs/relatorio.pdf).

## Modelo de dados (DER)

- **Corrida** — `id_corrida`, `nome`
- **Professor** — `id_professor`, `nome`
- **Checkpoint** — `id_checkpoint`, `numero`, `id_corrida` (FK), `id_professor` (FK)
- **Equipe** — `id_equipe`, `nome`
- **Passagem** — `id_passagem`, `momento`, `id_corrida` (FK), `id_checkpoint` (FK), `id_equipe` (FK)

O DDL correspondente está em [`schema.sql`](schema.sql).

## Primeira versão da API

Implementada em **Flask + SQLite** (`sqlite3` da biblioteca padrão, sem ORM). O banco (`banco.db`) é criado/atualizado automaticamente na inicialização.

Conforme o escopo desta etapa, **não há** autenticação, validação de entrada ou tratamento elaborado de erros — apenas as operações básicas sobre as tabelas do DER.

### Executando

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
python app.py
```

A API e a interface web sobem em `http://127.0.0.1:5000` (abra esse endereço no navegador). A interface é servida pelo próprio Flask, o que é necessário porque módulos ES não carregam via `file://`.

### Endpoints

| Recurso | Rota | Métodos |
| --- | --- | --- |
| Professores | `/professores` | `GET`, `POST` |
| | `/professores/<id>` | `GET`, `PUT`, `DELETE` |
| Corridas | `/corridas` | `GET` (inclui `total_checkpoints` e `total_passagens`), `POST` |
| | `/corridas/<id>` | `GET` (com checkpoints e passagens), `PUT`, `DELETE` (retorna `409` se a corrida tiver checkpoints ou passagens) |
| Checkpoints | `/corridas/<id_corrida>/checkpoints` | `GET`, `POST` |
| | `/checkpoints/<id>` | `GET`, `PUT`, `DELETE` |
| Equipes | `/equipes` | `GET`, `POST` |
| | `/equipes/<id>` | `GET`, `PUT`, `DELETE` |
| | `/equipes/<id>/historico` | `GET` — histórico de passagens (RF06) |
| Passagens | `/passagens` (aceita `?id_corrida=`) | `GET`, `POST` |
| | `/passagens/<id>` | `GET`, `DELETE` |

`POST /passagens` recebe `id_corrida`, `id_checkpoint` e `id_equipe`; o campo `momento` é preenchido automaticamente pelo servidor (RF04).

### Exemplo de uso

```bash
curl -X POST http://127.0.0.1:5000/professores -H "Content-Type: application/json" -d "{\"nome\":\"Prof. Ana\"}"
curl -X POST http://127.0.0.1:5000/corridas -H "Content-Type: application/json" -d "{\"nome\":\"Trilha da Serra\"}"
curl -X POST http://127.0.0.1:5000/corridas/1/checkpoints -H "Content-Type: application/json" -d "{\"numero\":1,\"id_professor\":1}"
curl -X POST http://127.0.0.1:5000/equipes -H "Content-Type: application/json" -d "{\"nome\":\"Equipe Aventura\"}"
curl -X POST http://127.0.0.1:5000/passagens -H "Content-Type: application/json" -d "{\"id_corrida\":1,\"id_checkpoint\":1,\"id_equipe\":1}"
curl http://127.0.0.1:5000/corridas/1
curl http://127.0.0.1:5000/equipes/1/historico
```

## Interface web

Interface em HTML, CSS e JavaScript (módulos ES) para o recurso **Corridas** (listar, criar, alterar e excluir), consumindo a API.

```
frontend/
├── index.html                      estrutura da página
├── css/estilo.css                  aparência
└── js/
    ├── classes/
    │   ├── Corrida.js              classe do recurso
    │   └── CorridaEmAndamento.js   especialização (herança)
    ├── servicos/api.js             comunicação com a API (fetch)
    ├── dados/corridas.js           coleção de objetos carregada da API
    ├── interface/corridas.js       apresentação e eventos
    └── script.js                   ponto de entrada
```

### Onde cada capítulo foi aplicado

| Capítulo | Conceito | Onde está |
| --- | --- | --- |
| Cap. 1 — JavaScript na página web | Criação de elementos com `createElement`/`textContent` e inserção no DOM | `render()` das classes e `criarCorridas()` em `interface/corridas.js` |
| Cap. 2 — Objetos e classes | Classe `Corrida` com atributos privados (`#id`, `#nome`, `#totalCheckpoints`, `#totalPassagens`), getters/setter e `render()`; herança em `CorridaEmAndamento` (corrida com passagens registradas: exibe selo "Em andamento" e não oferece "Excluir") | `classes/` |
| Cap. 3 — Eventos e interação | Botão "+ Nova corrida", formulário em `<dialog>`, botões com `data-acao`, `dataset.id`, criar/alterar/excluir sincronizando objeto e interface | `interface/corridas.js` + `index.html` |
| Cap. 4 — Módulos | `import`/`export`, `<script type="module">`, separação classes/dados/interface/inicialização e um módulo próprio para a API | toda a pasta `js/` |

Diferente dos exercícios originais, os dados agora vêm da API (`GET/POST/PUT/DELETE /corridas`) e persistem no SQLite.
