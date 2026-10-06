import sqlite3
from datetime import datetime
from pathlib import Path

from flask import Flask, g, jsonify, request

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "banco.db"
SCHEMA = BASE_DIR / "schema.sql"

app = Flask(__name__, static_folder="frontend", static_url_path="")


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    with sqlite3.connect(DATABASE) as db:
        db.executescript(SCHEMA.read_text(encoding="utf-8"))


def row_to_dict(row):
    return dict(row) if row else None


# ------------------------------------------------------------------ Interface

@app.route("/")
def index():
    return app.send_static_file("index.html")


# ---------------------------------------------------------------- Professores

@app.route("/professores", methods=["POST"])
def criar_professor():
    dados = request.get_json()
    db = get_db()
    cursor = db.execute("INSERT INTO professor (nome) VALUES (?)", (dados["nome"],))
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM professor WHERE id_professor = ?", (cursor.lastrowid,)
    ).fetchone())), 201


@app.route("/professores", methods=["GET"])
def listar_professores():
    db = get_db()
    linhas = db.execute("SELECT * FROM professor").fetchall()
    return jsonify([row_to_dict(linha) for linha in linhas])


@app.route("/professores/<int:id_professor>", methods=["GET"])
def obter_professor(id_professor):
    db = get_db()
    professor = db.execute(
        "SELECT * FROM professor WHERE id_professor = ?", (id_professor,)
    ).fetchone()
    return jsonify(row_to_dict(professor))


@app.route("/professores/<int:id_professor>", methods=["PUT"])
def atualizar_professor(id_professor):
    dados = request.get_json()
    db = get_db()
    db.execute(
        "UPDATE professor SET nome = ? WHERE id_professor = ?",
        (dados["nome"], id_professor),
    )
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM professor WHERE id_professor = ?", (id_professor,)
    ).fetchone()))


@app.route("/professores/<int:id_professor>", methods=["DELETE"])
def remover_professor(id_professor):
    db = get_db()
    db.execute("DELETE FROM professor WHERE id_professor = ?", (id_professor,))
    db.commit()
    return "", 204


# ------------------------------------------------------------------- Corridas

@app.route("/corridas", methods=["POST"])
def criar_corrida():
    dados = request.get_json()
    db = get_db()
    cursor = db.execute("INSERT INTO corrida (nome) VALUES (?)", (dados["nome"],))
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM corrida WHERE id_corrida = ?", (cursor.lastrowid,)
    ).fetchone())), 201


@app.route("/corridas", methods=["GET"])
def listar_corridas():
    db = get_db()
    linhas = db.execute(
        """
        SELECT id_corrida, nome,
               (SELECT COUNT(*) FROM checkpoint
                WHERE checkpoint.id_corrida = corrida.id_corrida) AS total_checkpoints,
               (SELECT COUNT(*) FROM passagem
                WHERE passagem.id_corrida = corrida.id_corrida) AS total_passagens
        FROM corrida
        """
    ).fetchall()
    return jsonify([row_to_dict(linha) for linha in linhas])


@app.route("/corridas/<int:id_corrida>", methods=["GET"])
def consultar_corrida(id_corrida):
    db = get_db()
    corrida = row_to_dict(db.execute(
        "SELECT * FROM corrida WHERE id_corrida = ?", (id_corrida,)
    ).fetchone())

    if corrida is None:
        return jsonify(None), 404

    checkpoints = [row_to_dict(linha) for linha in db.execute(
        "SELECT * FROM checkpoint WHERE id_corrida = ? ORDER BY numero", (id_corrida,)
    ).fetchall()]

    passagens = [row_to_dict(linha) for linha in db.execute(
        "SELECT * FROM passagem WHERE id_corrida = ? ORDER BY momento", (id_corrida,)
    ).fetchall()]

    corrida["checkpoints"] = checkpoints
    corrida["passagens"] = passagens
    return jsonify(corrida)


@app.route("/corridas/<int:id_corrida>", methods=["PUT"])
def atualizar_corrida(id_corrida):
    dados = request.get_json()
    db = get_db()
    db.execute(
        "UPDATE corrida SET nome = ? WHERE id_corrida = ?",
        (dados["nome"], id_corrida),
    )
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM corrida WHERE id_corrida = ?", (id_corrida,)
    ).fetchone()))


@app.route("/corridas/<int:id_corrida>", methods=["DELETE"])
def remover_corrida(id_corrida):
    db = get_db()
    try:
        db.execute("DELETE FROM corrida WHERE id_corrida = ?", (id_corrida,))
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Não é possível excluir uma corrida que possui checkpoints ou passagens registradas."}), 409
    return "", 204


# ---------------------------------------------------------------- Checkpoints

@app.route("/corridas/<int:id_corrida>/checkpoints", methods=["POST"])
def criar_checkpoint(id_corrida):
    dados = request.get_json()
    db = get_db()
    cursor = db.execute(
        "INSERT INTO checkpoint (numero, id_corrida, id_professor) VALUES (?, ?, ?)",
        (dados["numero"], id_corrida, dados["id_professor"]),
    )
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM checkpoint WHERE id_checkpoint = ?", (cursor.lastrowid,)
    ).fetchone())), 201


@app.route("/corridas/<int:id_corrida>/checkpoints", methods=["GET"])
def listar_checkpoints(id_corrida):
    db = get_db()
    linhas = db.execute(
        "SELECT * FROM checkpoint WHERE id_corrida = ? ORDER BY numero", (id_corrida,)
    ).fetchall()
    return jsonify([row_to_dict(linha) for linha in linhas])


@app.route("/checkpoints/<int:id_checkpoint>", methods=["GET"])
def obter_checkpoint(id_checkpoint):
    db = get_db()
    checkpoint = db.execute(
        "SELECT * FROM checkpoint WHERE id_checkpoint = ?", (id_checkpoint,)
    ).fetchone()
    return jsonify(row_to_dict(checkpoint))


@app.route("/checkpoints/<int:id_checkpoint>", methods=["PUT"])
def atualizar_checkpoint(id_checkpoint):
    dados = request.get_json()
    db = get_db()
    db.execute(
        "UPDATE checkpoint SET numero = ?, id_professor = ? WHERE id_checkpoint = ?",
        (dados["numero"], dados["id_professor"], id_checkpoint),
    )
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM checkpoint WHERE id_checkpoint = ?", (id_checkpoint,)
    ).fetchone()))


@app.route("/checkpoints/<int:id_checkpoint>", methods=["DELETE"])
def remover_checkpoint(id_checkpoint):
    db = get_db()
    db.execute("DELETE FROM checkpoint WHERE id_checkpoint = ?", (id_checkpoint,))
    db.commit()
    return "", 204


# -------------------------------------------------------------------- Equipes

@app.route("/equipes", methods=["POST"])
def criar_equipe():
    dados = request.get_json()
    db = get_db()
    cursor = db.execute("INSERT INTO equipe (nome) VALUES (?)", (dados["nome"],))
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM equipe WHERE id_equipe = ?", (cursor.lastrowid,)
    ).fetchone())), 201


@app.route("/equipes", methods=["GET"])
def listar_equipes():
    db = get_db()
    linhas = db.execute("SELECT * FROM equipe").fetchall()
    return jsonify([row_to_dict(linha) for linha in linhas])


@app.route("/equipes/<int:id_equipe>", methods=["GET"])
def obter_equipe(id_equipe):
    db = get_db()
    equipe = db.execute(
        "SELECT * FROM equipe WHERE id_equipe = ?", (id_equipe,)
    ).fetchone()
    return jsonify(row_to_dict(equipe))


@app.route("/equipes/<int:id_equipe>", methods=["PUT"])
def atualizar_equipe(id_equipe):
    dados = request.get_json()
    db = get_db()
    db.execute(
        "UPDATE equipe SET nome = ? WHERE id_equipe = ?",
        (dados["nome"], id_equipe),
    )
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM equipe WHERE id_equipe = ?", (id_equipe,)
    ).fetchone()))


@app.route("/equipes/<int:id_equipe>", methods=["DELETE"])
def remover_equipe(id_equipe):
    db = get_db()
    db.execute("DELETE FROM equipe WHERE id_equipe = ?", (id_equipe,))
    db.commit()
    return "", 204


@app.route("/equipes/<int:id_equipe>/historico", methods=["GET"])
def historico_equipe(id_equipe):
    db = get_db()
    linhas = db.execute(
        """
        SELECT passagem.id_passagem, passagem.momento,
               corrida.id_corrida, corrida.nome AS nome_corrida,
               checkpoint.id_checkpoint, checkpoint.numero AS numero_checkpoint
        FROM passagem
        JOIN corrida ON corrida.id_corrida = passagem.id_corrida
        JOIN checkpoint ON checkpoint.id_checkpoint = passagem.id_checkpoint
        WHERE passagem.id_equipe = ?
        ORDER BY passagem.momento
        """,
        (id_equipe,),
    ).fetchall()
    return jsonify([row_to_dict(linha) for linha in linhas])


# ------------------------------------------------------------------ Passagens

@app.route("/passagens", methods=["POST"])
def registrar_passagem():
    dados = request.get_json()
    db = get_db()
    cursor = db.execute(
        """
        INSERT INTO passagem (momento, id_corrida, id_checkpoint, id_equipe)
        VALUES (?, ?, ?, ?)
        """,
        (
            datetime.now().isoformat(timespec="seconds"),
            dados["id_corrida"],
            dados["id_checkpoint"],
            dados["id_equipe"],
        ),
    )
    db.commit()
    return jsonify(row_to_dict(db.execute(
        "SELECT * FROM passagem WHERE id_passagem = ?", (cursor.lastrowid,)
    ).fetchone())), 201


@app.route("/passagens", methods=["GET"])
def listar_passagens():
    db = get_db()
    id_corrida = request.args.get("id_corrida")

    if id_corrida:
        linhas = db.execute(
            "SELECT * FROM passagem WHERE id_corrida = ? ORDER BY momento", (id_corrida,)
        ).fetchall()
    else:
        linhas = db.execute("SELECT * FROM passagem ORDER BY momento").fetchall()

    return jsonify([row_to_dict(linha) for linha in linhas])


@app.route("/passagens/<int:id_passagem>", methods=["GET"])
def obter_passagem(id_passagem):
    db = get_db()
    passagem = db.execute(
        "SELECT * FROM passagem WHERE id_passagem = ?", (id_passagem,)
    ).fetchone()
    return jsonify(row_to_dict(passagem))


@app.route("/passagens/<int:id_passagem>", methods=["DELETE"])
def remover_passagem(id_passagem):
    db = get_db()
    db.execute("DELETE FROM passagem WHERE id_passagem = ?", (id_passagem,))
    db.commit()
    return "", 204


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
