CREATE TABLE IF NOT EXISTS professor (
    id_professor INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS corrida (
    id_corrida INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS equipe (
    id_equipe INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkpoint (
    id_checkpoint INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL,
    id_corrida INTEGER NOT NULL,
    id_professor INTEGER NOT NULL,
    FOREIGN KEY (id_corrida) REFERENCES corrida (id_corrida),
    FOREIGN KEY (id_professor) REFERENCES professor (id_professor)
);

CREATE TABLE IF NOT EXISTS passagem (
    id_passagem INTEGER PRIMARY KEY AUTOINCREMENT,
    momento TEXT NOT NULL,
    id_corrida INTEGER NOT NULL,
    id_checkpoint INTEGER NOT NULL,
    id_equipe INTEGER NOT NULL,
    FOREIGN KEY (id_corrida) REFERENCES corrida (id_corrida),
    FOREIGN KEY (id_checkpoint) REFERENCES checkpoint (id_checkpoint),
    FOREIGN KEY (id_equipe) REFERENCES equipe (id_equipe)
);
