create table public.pacientes (
  seqpaciente uuid not null default gen_random_uuid (),
  nomepaciente text not null,
  codpaciente text null,
  senhapaciente text null,
  constraint pacientes_pkey primary key (seqpaciente),
  constraint usuario_codusuario_key unique (codpaciente)
) TABLESPACE pg_default;