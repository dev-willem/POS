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

Implementada em **Flask + SQLite** (`sqlite3` da biblioteca padrão, sem ORM). O banco (`banco.db`) é criado automaticamente na primeira execução.

Conforme o escopo desta etapa, **não há** autenticação, validação de entrada ou tratamento elaborado de erros — apenas as operações básicas sobre as tabelas do DER.

### Executando

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
python app.py
```

A API sobe em `http://127.0.0.1:5000`.

### Endpoints

| Recurso | Rota | Métodos |
| --- | --- | --- |
| Professores | `/professores` | `GET`, `POST` |
| | `/professores/<id>` | `GET`, `PUT`, `DELETE` |
| Corridas | `/corridas` | `GET`, `POST` |
| | `/corridas/<id>` | `GET` (com checkpoints e passagens), `PUT`, `DELETE` |
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
