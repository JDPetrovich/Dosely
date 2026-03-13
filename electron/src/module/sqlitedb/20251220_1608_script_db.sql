CREATE TABLE IF NOT EXISTS usuario (
    seqUsuario INTEGER PRIMARY KEY,
    nomeUsuario TEXT,
    dtnascimentousuario TEXT,
    codusuario TEXT,
    senhaUsuario TEXT,
    cpfusuario TEXT,
    telusuario INTEGER,
    emailusuario TEXT
);

CREATE TABLE IF NOT EXISTS historico_remedios(
seqhistorico INTEGER PRIMARY KEY,
sequsuario INTEGER,
descremedio TEXT, 
status INTEGER,
dataconfimacao DATE,
FOREIGN KEY (sequsuario) REFERENCES usuario(sequsuario) ON DELETE CASCADE
);