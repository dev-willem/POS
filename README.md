# POS

Repositório com os trabalhos da pós-graduação, organizados por disciplina.

## Exercícios de JavaScript (capítulos 1 a 5)

Aplicados na interface web do projeto, em [`pos-projeto-final/frontend/`](pos-projeto-final/frontend). Ver [Onde cada capítulo foi aplicado](pos-projeto-final/README.md#onde-cada-capítulo-foi-aplicado).

## Versões (branches)

| Branch | Conteúdo |
| --- | --- |
| `frontend-v1` | Exercícios dos capítulos 1 a 3 (páginas avulsas com o recurso Corridas) |
| `frontend-v2` | Refatoração em módulos (Cap. 4), front de Corridas consumindo a API Flask |
| `frontend-v3` | Recursos relacionados (Corrida, Professor, Checkpoint) com persistência em localStorage (Cap. 5) |
| `prova-pratica` | Prova prática: status da corrida (Criada, Iniciada, Encerrada) e registro de checkpoints somente em corridas iniciadas |
| `frontend-v4` | Módulo de componentes: as classes do domínio deixam de construir HTML (`render()` removido) e a interface passa a usar `interface/componentes.js` |
| `frontend-v5` | Integração com API REST (JSON Server): módulos `js/api/`, `db.json`, tratamento de erros e registro de testes em `docs/testes-api-rest.md` |

## Projeto final — Programação Orientada a Serviços

- [`pos-projeto-final/`](pos-projeto-final) — Atividade 1 (Análise, Modelagem, Prototipação e Primeira Implementação) do estudo de caso **Controle de Checkpoints em Corridas de Trekking**: documentação (requisitos, casos de uso, DER, protótipo) em `docs/relatorio.pdf`, API em Flask + SQLite e interface web (detalhes no README da pasta).
