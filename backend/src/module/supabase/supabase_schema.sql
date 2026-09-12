create table public.pacientes (
  seqpaciente uuid not null default gen_random_uuid (),
  nome text not null,
  login text not null unique,
  senha text null,
  constraint pacientes_pkey primary key (seqpaciente),
  constraint usuario_codusuario_key unique (login)
) TABLESPACE pg_default;

CREATE TABLE public.historico_remedios (
    seqhistorico UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seqpaciente UUID NOT NULL,
    seqtratamento_origem BIGINT NOT NULL,
    seqtratamentoitem_origem BIGINT NOT NULL,
    seqmedicamento_origem BIGINT NOT NULL,
    medicamento_nome TEXT NOT NULL,
    quantidade NUMERIC NOT NULL,
    unidade TEXT NOT NULL,
    data_hora_prevista TIMESTAMPTZ NOT NULL,
    data_hora_confirmada TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'PENDENTE',
    observacao TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (seqpaciente)
        REFERENCES public.pacientes(seqpaciente)
        ON DELETE CASCADE,
    CHECK (quantidade > 0),
    CHECK (
        status IN ('PENDENTE', 'TOMADO', 'PULADO')
    ),
    CHECK (
        status <> 'TOMADO'
        OR data_hora_confirmada IS NOT NULL
    ),
    UNIQUE (
        seqpaciente,
        seqtratamentoitem_origem,
        data_hora_prevista
    )
);