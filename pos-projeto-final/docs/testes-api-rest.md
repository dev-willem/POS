# Registro de testes — Frontend v.5 (API REST)

Testes da integração da interface com o JSON Server (`json-server 1.0.0-beta.15`, `db.json` com os registros iniciais).

**Como foram executados:** a interface foi aberta em um navegador real (Chromium) e operada como um usuário (cliques, formulários, confirmações), de forma automatizada, contra o JSON Server em execução. Em cada cenário o resultado foi conferido na tela **e** na resposta da API (`GET` direto em `http://localhost:3000`). O servidor foi parado e reiniciado durante os testes para simular falhas. O roteiro manual equivalente está em [README > Como testar](../README.md#como-testar).

**Resultado geral:** 37 cenários executados, 37 aprovados (duas execuções completas consecutivas, sem falhas), sem nenhum erro de JavaScript no console.

## 1. Carga dos registros a partir da API

| Cenário | Resultado |
| --- | --- |
| Corridas: 3 cards, com os status `Iniciada`, `Criada` e `Encerrada` e os totais de checkpoints (2, 0 e 1) | Aprovado |
| Professores: 4 cards, com o total de checkpoints de cada um | Aprovado |
| Checkpoints: 3 cards, com corrida e professor relacionados, ordenados por corrida e número | Aprovado |
| Os dados vêm da API (`GET /corridas`, `/professores`, `/checkpoints`) e o `localStorage` fica vazio | Aprovado |

## 2. Cadastro e persistência no servidor

| Cenário | Resultado |
| --- | --- |
| Cadastrar corrida: aparece na lista como `Criada`, existe em `GET /corridas` com id textual e continua após recarregar | Aprovado |
| Cadastrar professor: existe em `GET /professores` | Aprovado |
| Cadastrar checkpoint em corrida `Iniciada`: gravado com `corridaId` e `professorId` textuais corretos | Aprovado |

## 3. Alteração

| Cenário | Resultado |
| --- | --- |
| Alterar corrida: formulário vem preenchido; nome atualizado na API e status preservado | Aprovado |
| Alterar professor: nome atualizado na API e refletido nos checkpoints relacionados | Aprovado |
| Alterar checkpoint: número e professor atualizados na API; formulário vem com a corrida e o professor atuais selecionados | Aprovado |

## 4. Exclusão

| Cenário | Resultado |
| --- | --- |
| Excluir checkpoint: some da lista e `GET /checkpoints/:id` retorna `404` | Aprovado |
| Cancelar a confirmação de exclusão: nada é removido | Aprovado |
| Excluir professor sem checkpoints: removido da API | Aprovado |
| Excluir corrida sem checkpoints: removida da API | Aprovado |

## 5. Recursos relacionados

| Cenário | Resultado |
| --- | --- |
| Os totais de checkpoints por corrida e por professor refletem o servidor depois de cadastrar e alterar | Aprovado |
| Mover um checkpoint para outra corrida `Iniciada` atualiza o `corridaId` e mantém o professor | Aprovado |

## 6. Regras de negócio

| Cenário | Resultado |
| --- | --- |
| Excluir corrida com checkpoints é bloqueado e a corrida continua na API | Aprovado |
| Excluir professor responsável por checkpoints é bloqueado e continua na API | Aprovado |
| Número de checkpoint repetido na mesma corrida é recusado; nada é gravado | Aprovado |
| O mesmo número em outra corrida é permitido | Aprovado |
| O formulário de novo checkpoint lista só corridas `Iniciada` | Aprovado |
| Corrida `Criada` forçada no formulário (opção injetada no DOM): a operação é recusada pela lógica e nada é gravado | Aprovado |
| Corrida `Encerrada` forçada no formulário: recusada, nada é gravado | Aprovado |
| Transições `Criada → Iniciada → Encerrada`: status gravado na API a cada passo e botões de acordo com o status (`Iniciar`; `Encerrar`; nenhum dos dois) | Aprovado |
| Encerrar uma corrida preserva os checkpoints já registrados | Aprovado |
| Tela desatualizada: outra origem encerra a corrida pela API e a tela ainda mostra `Iniciar`; a transição é recusada com a mensagem de status atual e a API não muda | Aprovado |
| Tela desatualizada: a corrida é encerrada pela API com o formulário de checkpoint já aberto; registrar o checkpoint é recusado | Aprovado |
| Nome em branco é recusado antes de qualquer `POST` | Aprovado |

## 7. Identificadores textuais

| Cenário | Resultado |
| --- | --- |
| Todos os ids e chaves de relacionamento (`id`, `corridaId`, `professorId`) são textos não numéricos; a interface funciona com eles | Aprovado |
| Ids gerados pelo JSON Server (ex.: `iHoWInKVIt8`) funcionam em cadastrar, alterar e excluir | Aprovado |
| Corrida com id texto que parece número (`"42"`) e corrida com id numérico (`7`), semeados no `db.json`: seleção no formulário, associação do checkpoint, total na lista e bloqueio de exclusão funcionam nos dois formatos | Aprovado |

## 8. Falhas de comunicação

| Cenário | Resultado |
| --- | --- |
| Resposta `500` ao cadastrar: *"Não foi possível cadastrar a corrida. A API respondeu com erro 500 ..."* e nada é criado | Aprovado |
| Excluir um registro que outra origem já removeu (`404`): mensagem *"Não foi possível excluir a corrida. O registro não foi encontrado ..."* | Aprovado |
| JSON Server parado com a página aberta: cadastrar, alterar e excluir mostram *"... Não foi possível se comunicar com a API ... Verifique se o JSON Server está em execução."*; a lista que já estava na tela é mantida | Aprovado |
| JSON Server parado ao abrir Corridas, Professores e Checkpoints: cada página mostra *"Não foi possível carregar ..."* com a causa, sem quebrar a tela | Aprovado |
| JSON Server reiniciado: ao recarregar, a lista volta a carregar e a mensagem some | Aprovado |

## Problemas encontrados e corrigidos durante os testes

- **Consultas por id textual que parece número.** A primeira versão consultava os checkpoints de uma corrida com `GET /checkpoints?corridaId=<id>`. O JSON Server converte o valor da query para número e compara de forma estrita, então `?corridaId=42` não encontra `"corridaId": "42"`. Com ids como `"1"`, `"2"` (comuns em `db.json`), isso desligaria o bloqueio de exclusão e a checagem de número repetido. Correção: `buscarCheckpointsDaCorrida` e `buscarCheckpointsDoProfessor` buscam `GET /checkpoints` e filtram no cliente com `mesmoId`. O cenário de ids `"42"` e `7` da seção 7 cobre esse caso.

## Observações sobre o JSON Server usado

- O `id` enviado no `POST` é ignorado: o servidor sempre gera um id textual. Ids numéricos ou como `"42"` só existem se vierem do `db.json`.
- O servidor observa o `db.json` e o recarrega quando o arquivo muda. Alterar o arquivo à mão com o servidor em execução é refletido na API.
