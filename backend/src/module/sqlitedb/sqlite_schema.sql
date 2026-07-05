CREATE TABLE usuario (
    sequsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL
);

CREATE TABLE usuario_refresh_token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sequsuario INTEGER NOT NULL,
    token TEXT NOT NULL,
    expira_em INTEGER NOT NULL,
    revogado INTEGER DEFAULT 0,
    criado_em INTEGER DEFAULT (strftime('%s','now')),
    FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paciente (
    seqpaciente INTEGER PRIMARY KEY,
    sequsuario INTEGER,
    nomepaciente TEXT,
    dtnascimentopaciente TEXT,
    codpaciente TEXT,
    senhapaciente TEXT,
    cpfpaciente TEXT,
    telpaciente TEXT,
    emailpaciente TEXT,
    FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alergia(
seqalergia INTEGER PRIMARY KEY,
sequsuario INTEGER,
descalergia TEXT,
FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alergia_paciente(
seqpaciente INTEGER,
seqalergia INTEGER,
dataregistro TEXT DEFAULT CURRENT_DATE,
PRIMARY KEY (seqpaciente, seqalergia),
FOREIGN KEY (seqpaciente) REFERENCES paciente(seqpaciente) ON DELETE CASCADE,
FOREIGN KEY (seqalergia) REFERENCES alergia(seqalergia) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medicamento(
seqmedicamento INTEGER PRIMARY KEY,
sequsuario INTEGER,
nomemedicamento TEXT,
descmedicamento TEXT,
dosagem TEXT,
FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medicamento_paciente(
seqmedicamentopaciente INTERGER PRIMARY KEY,
seqpaciente INTEGER,
seqmedicamento INTEGER,
ativo BOOLEAN DEFAULT 1,
tipo TEXT,
stock INTEGER DEFAULT 0,
tipohorario TEXT,
horario TEXT,
tipoperiodo TEXT,
periodo TEXT,
FOREIGN KEY (seqpaciente) REFERENCES paciente(seqpaciente) ON DELETE CASCADE,
FOREIGN KEY (seqmedicamento) REFERENCES medicamento(seqmedicamento) ON DELETE CASCADE
);

CREATE TABLE combo_item (
    seqcomboitem INTEGER PRIMARY KEY,
    seqmedicamentopaciente_combo INTEGER,
    seqmedicamento_item INTEGER,
    FOREIGN KEY (seqmedicamentopaciente_combo) REFERENCES medicamento_paciente(seqmedicamentopaciente) ON DELETE CASCADE,
    FOREIGN KEY (seqmedicamento_item) REFERENCES medicamento(seqmedicamento)
);

CREATE TABLE IF NOT EXISTS historico_remedios(
seqhistorico INTEGER PRIMARY KEY,
sequsuario INTEGER,
descremedio TEXT, 
status INTEGER,
dataconfimacao DATE,
FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);