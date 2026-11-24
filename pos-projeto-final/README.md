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

A API Flask e a interface sobem em `http://127.0.0.1:5000`. A interface não consome a API Flask: desde o Frontend v.5 ela usa o JSON Server (porta 3000, veja [Interface web](#interface-web)), e o Flask só serve os arquivos estáticos, já que módulos ES não carregam via `file://`.

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

CRUD de **Corrida**, **Professor** e **Checkpoint** em HTML, CSS e JavaScript (módulos ES). Desde o Frontend v.5 os dados ficam em uma **API REST (JSON Server)**, e não mais no `localStorage`.

### Como executar

Pré-requisitos: Python 3.10+ (veja [Executando](#executando)) e Node.js 22.12 ou mais recente (exigência do JSON Server 1). São dois processos, cada um em um terminal:

```bash
# Terminal 1 - API REST (JSON Server, http://localhost:3000)
cd pos-projeto-final
npm install
npm run api
```

```bash
# Terminal 2 - interface (Flask, http://127.0.0.1:5000), com o venv ativo
python app.py
```

Abra `http://127.0.0.1:5000/`. Se o JSON Server não estiver em execução, as páginas exibem a mensagem de que não foi possível comunicar com a API.

- Para conferir a API: `curl http://localhost:3000/corridas` ou abra a mesma URL no navegador.
- O JSON Server grava as alterações em [`db.json`](db.json). Para voltar aos dados iniciais: `git checkout db.json`.
- Qualquer servidor de arquivos estáticos serve no lugar do Flask. O endereço da API fica em `URL_BASE`, em [`frontend/js/api/http.js`](frontend/js/api/http.js).

```
frontend/
├── index.html / corridas.html / professores.html / checkpoints.html
├── css/estilo.css
└── js/
    ├── corridas.js, professores.js, checkpoints.js   pontos de entrada das páginas
    ├── classes/     Corrida.js, Professor.js, Checkpoint.js
    ├── api/         http.js                                        (função requisicao e ErroApi)
    │                id.js                                          (critério único de comparação de ids)
    │                corridas.js, professores.js, checkpoints.js   (listar, buscar, cadastrar, atualizar, remover)
    │                dados.js                                       (carrega os três recursos e liga as referências)
    └── interface/   componentes.js                                 (construção dos elementos HTML)
                     mensagens.js                                   (mensagem de status e tratamento de erros)
                     corridas.js, professores.js, checkpoints.js   (listas, formulários, eventos, regras)
```

### Módulo de componentes (Frontend v.4)

As classes do domínio deixaram de construir HTML: toda a criação de elementos foi transferida para [`frontend/js/interface/componentes.js`](frontend/js/interface/componentes.js).

**Métodos de renderização identificados e removidos**

| Classe | Método removido | O que apresentava |
| --- | --- | --- |
| `Corrida` | `render(totalCheckpoints)` | Nome, status (selo colorido), total de checkpoints e botões Iniciar/Encerrar (conforme o status), Alterar e Excluir |
| `Professor` | `render(totalCheckpoints)` | Nome, total de checkpoints sob responsabilidade e botões Alterar e Excluir |
| `Checkpoint` | `render()` | Número, corrida, professor responsável e botões Alterar e Excluir |

Além disso, `interface/checkpoints.js` montava as `<option>` dos selects (`preencherSelect`) e as três listas montavam o parágrafo de "lista vazia"; esse código também foi para os componentes.

As classes ficaram só com atributos, construtor, getters/setters e regras de comportamento (por exemplo `iniciar()`, `encerrar()` e `aceitaCheckpoints` em `Corrida`). Nenhuma delas referencia `document`.

**Componentes criados** (todos retornam o elemento criado; quem chama decide onde inseri-lo)

| Função | Recebe | Retorna |
| --- | --- | --- |
| `criarItemCorrida(corrida, totalCheckpoints, { aoIniciar, aoEncerrar, aoAlterar, aoExcluir })` | corrida, total de checkpoints e callbacks | cartão `.corrida`; mostra só as ações compatíveis com o status |
| `criarItemProfessor(professor, totalCheckpoints, { aoAlterar, aoExcluir })` | professor, total e callbacks | cartão `.professor` |
| `criarItemCheckpoint(checkpoint, { aoAlterar, aoExcluir })` | checkpoint e callbacks | cartão `.checkpoint` |
| `criarOpcoes(textoInicial, itens)` | texto inicial e lista de itens com `id` e `nome` | lista de `<option>` (a primeira, desabilitada, é o texto inicial) |
| `criarMensagemVazia(texto)` | texto | parágrafo `<p>` da lista vazia |

Os componentes usam `textContent` (nunca `innerHTML` com dados) e não conhecem regras de negócio: ao clicar em um botão apenas chamam o callback recebido, com a entidade como argumento.

**Responsabilidades de cada módulo**

| Módulo | Responsabilidade |
| --- | --- |
| `classes/` | Representar as entidades (atributos, validações e comportamento), sem conhecer HTML |
| `api/` | Falar com o servidor: montar as requisições HTTP e converter as respostas em objetos das classes (sem conhecer HTML) |
| `interface/componentes.js` | Transformar os dados das entidades em elementos HTML |
| `interface/mensagens.js` | Exibir mensagens de status e transformar falhas das operações em mensagens para o usuário |
| `interface/corridas.js`, `professores.js`, `checkpoints.js` | Regras das operações (criar, alterar, excluir, transições de status), formulários e eventos; chamam `api/` e usam os componentes para exibir as listas (`renderizarCorridas`, `renderizarProfessores`, `renderizarCheckpoints`) |
| `corridas.js`, `professores.js`, `checkpoints.js` (raiz de `js/`) | Ponto de entrada de cada página |

```mermaid
classDiagram
    class Corrida { id; nome; status }
    class Professor { id; nome }
    class Checkpoint { id; numero; corrida; professor }
    Checkpoint "0..*" --> "1" Corrida
    Checkpoint "0..*" --> "1" Professor
```

### Persistência e integração com a API REST (Frontend v.5)

Os dados ficam em [`db.json`](db.json), servido pelo JSON Server (`json-server 1.0.0-beta.15`). Há uma coleção para cada recurso e os relacionamentos são ids guardados no checkpoint:

```json
{
  "corridas":    [{ "id": "a3f9", "nome": "Trilha da Serra", "status": "Iniciada" }],
  "professores": [{ "id": "d41a", "nome": "Prof. Ana Souza" }],
  "checkpoints": [{ "id": "k7c1", "numero": 1, "corridaId": "a3f9", "professorId": "d41a" }]
}
```

O arquivo já traz registros iniciais (três corridas, uma em cada status, quatro professores e três checkpoints) para testar a aplicação.

| Recurso | Rotas usadas pela interface |
| --- | --- |
| Corridas | `GET /corridas`, `GET /corridas/:id`, `POST /corridas`, `PATCH /corridas/:id` (nome ou status), `DELETE /corridas/:id` |
| Professores | `GET /professores`, `GET /professores/:id`, `POST /professores`, `PATCH /professores/:id`, `DELETE /professores/:id` |
| Checkpoints | `GET /checkpoints`, `POST /checkpoints`, `PATCH /checkpoints/:id`, `DELETE /checkpoints/:id` |

**O que mudou em relação à versão com `localStorage`**

- A pasta `js/dados/` (listas em memória + `localStorage`) foi substituída por `js/api/`. As classes continuam as mesmas, mas deixaram de gerar ids: o `id` é criado pelo servidor (`proximoId` e o `Math.max` foram removidos).
- `api/http.js` concentra a única chamada ao `fetch` (`requisicao`) e o erro `ErroApi`. `api/corridas.js`, `api/professores.js` e `api/checkpoints.js` expõem `listar`, `buscar`, `cadastrar`, `atualizar` e `remover`, e devolvem objetos `Corrida`, `Professor` e `Checkpoint`; a interface nunca monta uma requisição.
- `api/dados.js` carrega corridas e professores e, com eles, reconstrói as referências dos checkpoints pelos ids, como a versão anterior fazia na carga do `localStorage`.
- Os módulos de `interface/` ficaram assíncronos (`async`/`await`): depois de cada operação bem-sucedida a lista é recarregada da API, então a tela sempre mostra o que está no servidor. Os componentes (`componentes.js`) não mudaram.

**Identificadores**

O JSON Server gera ids textuais (ex.: `iHoWInKVIt8`) e ignora o `id` enviado no `POST`. Por isso o código nunca converte ids para número: `id`, `corridaId` e `professorId` são guardados como vieram da API, e todas as comparações usam `mesmoId` (`api/id.js`), que compara como texto, inclusive com o `value` de um `<select>`. O filtro por query string do JSON Server (`?corridaId=42`) não casa ids textuais que parecem número, então as consultas por corrida ou professor são feitas no cliente sobre `GET /checkpoints`.

**Regras de negócio**

O JSON Server não aplica regras, então elas continuam na aplicação e são verificadas contra os dados **atuais da API**, não contra o que está na tela (que pode estar desatualizada):

- Corrida ou professor com checkpoints não pode ser excluído.
- O número de um checkpoint não pode se repetir na mesma corrida.
- Checkpoints só são registrados em corridas `Iniciada` (ao criar, ou ao mover um checkpoint para outra corrida).
- O status avança só em `Criada → Iniciada → Encerrada`: `Corrida.iniciar()` e `Corrida.encerrar()` são chamados sobre a corrida lida da API antes do `PATCH`.
- Encerrar uma corrida não apaga os checkpoints já registrados.

Em um sistema real essas regras críticas também devem ser protegidas no servidor.

**Tratamento de erros**

`requisicao` converte as falhas em `ErroApi` com mensagem legível: API fora do ar (`fetch` falhou), `404` (registro já removido) e qualquer outro status HTTP de erro. `interface/mensagens.js` mostra o texto no `#status` da página, com o contexto da operação, por exemplo: *"Não foi possível cadastrar a corrida. Não foi possível se comunicar com a API (http://localhost:3000). Verifique se o JSON Server está em execução."*. Falhas de carregamento aparecem como *"Não foi possível carregar as corridas. ..."*.

O registro dos testes executados está em [`docs/testes-api-rest.md`](docs/testes-api-rest.md).

### Ciclo de vida da corrida

Cada corrida tem um `status`: `Criada`, `Iniciada` ou `Encerrada`.

```mermaid
stateDiagram-v2
    [*] --> Criada
    Criada --> Iniciada: iniciar()
    Iniciada --> Encerrada: encerrar()
    Encerrada --> [*]
```

- A classe `Corrida` concentra a regra: `iniciar()` só funciona em corridas `Criada` e `encerrar()` só em corridas `Iniciada`; qualquer outra transição lança um erro e não altera o status. O getter `aceitaCheckpoints` informa se a corrida está `Iniciada`.
- A listagem de corridas mostra o status e oferece só a ação compatível: **Iniciar** (corrida `Criada`) ou **Encerrar** (corrida `Iniciada`, com confirmação). Corrida `Encerrada` não tem nenhuma das duas.
- O registro de checkpoints só é aceito em corridas `Iniciada`. A verificação está em `criarCheckpoint` e em `alterarCheckpoint` (mover um checkpoint para outra corrida equivale a registrá-lo nela), em `interface/checkpoints.js`, e não só no formulário: mesmo que a opção de uma corrida `Criada` ou `Encerrada` seja forçada no formulário, a operação é recusada com mensagem.
- Encerrar uma corrida não apaga nada: os checkpoints já registrados permanecem.
- O status é salvo na API (`PATCH /corridas/:id`) a cada transição e mantido após recarregar a página.

### Regras de integridade

- Corrida ou professor com checkpoints não pode ser excluído (é exibida uma mensagem).
- O número de um checkpoint não pode se repetir dentro da mesma corrida.
- Novos checkpoints só podem ser registrados em corridas `Iniciada`.
- O status só avança na sequência `Criada → Iniciada → Encerrada`.

### Como testar

Com a API (`npm run api`) e o Flask (`python app.py`) em execução:

1. Cadastre algumas corridas e professores (ou use os registros iniciais do `db.json`). As corridas nascem como `Criada`.
2. Em Checkpoints, clique em "Novo checkpoint": é exibida a mensagem de que não há corrida iniciada.
3. Em Corridas, clique em **Iniciar** em uma corrida; o status muda para `Iniciada` e o botão passa a ser **Encerrar**.
4. Cadastre um checkpoint selecionando a corrida iniciada e o professor.
5. Recarregue a página e verifique que os dados, as relações e o status continuam exibidos.
6. Clique em **Encerrar** (e confirme): o status vira `Encerrada`, os botões Iniciar/Encerrar somem e os checkpoints já registrados continuam na página Checkpoints.
7. Tente registrar outro checkpoint: a corrida encerrada não aparece na lista e, se for forçada, a operação é recusada.
8. Altere e exclua registros.
9. Tente excluir uma corrida ou um professor que tenha checkpoints e veja a mensagem de bloqueio.
10. Confira os dados em `http://localhost:3000/corridas`, `/professores` e `/checkpoints` (ou no `db.json`).
11. Pare o JSON Server (`Ctrl + C`) e tente cadastrar algo ou recarregar a página: a tela mostra uma mensagem de erro de comunicação com a API.

### Onde cada capítulo foi aplicado

| Capítulo | Conceito | Onde está |
| --- | --- | --- |
| Cap. 1 — JavaScript na página web | Criação de elementos com `createElement`/`textContent` e inserção no DOM | `interface/componentes.js` (antes, `render()` das classes) |
| Cap. 2 — Objetos e classes | Classes com atributos privados, getters/setters e métodos de comportamento; exemplo de herança (`CorridaEmAndamento`) na branch `frontend-v2` | `classes/` |
| Cap. 3 — Eventos e interação | Eventos, formulários em `<dialog>`, botões com `data-acao`, `dataset` | `interface/` + páginas `.html` |
| Cap. 4 — Módulos | `import`/`export`, separação classes/dados/interface e pontos de entrada por página | toda a pasta `js/` |
| Cap. 5 — Recursos relacionados e localStorage | Recursos relacionados, referências entre objetos, reconstrução de objetos e relações, integridade (o `localStorage` foi usado até a branch `frontend-v4`) | `classes/Checkpoint.js`, `api/checkpoints.js`, `interface/checkpoints.js` |
| Frontend v.4 — Módulo de componentes | Separação entre domínio e apresentação: funções que constroem os elementos e recebem callbacks | `interface/componentes.js` |
| Frontend v.5 — API REST | `fetch` com `async`/`await`, JSON Server, ids textuais, tratamento de erros HTTP | `api/`, `interface/mensagens.js`, `db.json` |
