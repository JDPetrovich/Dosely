CREATE TABLE usuario (
    sequsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    tentativas_login INTEGER DEFAULT 0,
    nivel_bloqueio INTEGER DEFAULT 0,
    bloqueado_ate INTEGER,
    status TEXT DEFAULT 'active'
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
    nome TEXT,
    data_nascimento TEXT,
    login TEXT,
    senha TEXT,
    cpf TEXT,
    telefone TEXT,
    email TEXT,
    FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alergia(
seqalergia INTEGER PRIMARY KEY,
sequsuario INTEGER,
descricao TEXT,
FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alergia_paciente(
seqpaciente INTEGER,
seqalergia INTEGER,
data_registro TEXT DEFAULT CURRENT_DATE,
PRIMARY KEY (seqpaciente, seqalergia),
FOREIGN KEY (seqpaciente) REFERENCES paciente(seqpaciente) ON DELETE CASCADE,
FOREIGN KEY (seqalergia) REFERENCES alergia(seqalergia) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medicamento(
seqmedicamento INTEGER PRIMARY KEY,
sequsuario INTEGER,
nome TEXT,
descricao TEXT,
dosagem TEXT,
FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tratamento (
    seqtratamento INTEGER PRIMARY KEY,
    seqpaciente INTEGER NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    tipo_repeticao TEXT NOT NULL,
    intervalo_dias INTEGER,
    tipo_horario TEXT NOT NULL,
    horario_inicio TEXT,
    intervalo_horas INTEGER,
    FOREIGN KEY (seqpaciente)
        REFERENCES paciente(seqpaciente)
        ON DELETE CASCADE,
    CHECK (tipo_repeticao IN ('DIARIA', 'A_CADA_DIAS')),
    CHECK (
        (tipo_repeticao = 'DIARIA' AND intervalo_dias IS NULL)
        OR
        (
            tipo_repeticao = 'A_CADA_DIAS'
            AND intervalo_dias IS NOT NULL
            AND intervalo_dias > 0
        )
    ),
    CHECK (tipo_horario IN ('EXATO', 'INTERVALO')),
    CHECK (
        (
            tipo_horario = 'EXATO'
            AND horario_inicio IS NULL
            AND intervalo_horas IS NULL
        )
        OR
        (
            tipo_horario = 'INTERVALO'
            AND horario_inicio IS NOT NULL
            AND intervalo_horas IS NOT NULL
            AND intervalo_horas > 0
        )
    ),
    CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);

CREATE TABLE IF NOT EXISTS tratamento_horario (
    seqtratamentohorario INTEGER PRIMARY KEY,
    seqtratamento INTEGER NOT NULL,
    horario TEXT NOT NULL,
    FOREIGN KEY (seqtratamento)
        REFERENCES tratamento(seqtratamento)
        ON DELETE CASCADE,
    UNIQUE (seqtratamento, horario)
);

CREATE TABLE IF NOT EXISTS tratamento_item (
    seqtratamentoitem INTEGER PRIMARY KEY,
    seqtratamento INTEGER NOT NULL,
    seqmedicamento INTEGER NOT NULL,
    quantidade REAL NOT NULL,
    unidade TEXT NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (seqtratamento)
        REFERENCES tratamento(seqtratamento)
        ON DELETE CASCADE,
    FOREIGN KEY (seqmedicamento)
        REFERENCES medicamento(seqmedicamento)
        ON DELETE RESTRICT,
    CHECK (quantidade > 0),
    CHECK (estoque >= 0)
);