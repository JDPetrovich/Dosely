export type {
    TipoRepeticao,
    TipoHorario,
    ITratamentoItemBase,
    ICriarTratamentoItem,
    ITratamentoItem,
    ITratamentoHorario,
    ITratamentoBody,
    ICriarTratamento,
    ITratamento,
    ITratamentoItemDetalhado,
    ITratamentoDetalhado,
    IEditarTratamento
} from "./interfaces/tratamento/tratamento.interface.js";

export type {
    IPaciente,
    IPacienteBody,
    ITelaPaciente,
    ICriarPaciente,
    IEditarPaciente,
    Ilogin
} from "./interfaces/paciente/paciente.interface.js";

export type {
    IMedicamento,
    IMedicamentobody,
    ICriarMedicamento,
    IEditarMedicamento
} from "./interfaces/medicamento/medicamento.interface.js";

export type {
    IUsuario
} from "./interfaces/usuario/usuario.interface.js";

export type {
    IAlergiaBody,
    IAlergia,
    ICriarAlergia,
    IEditarAlergia,
    IAlergiaPaciente,
    IAssociarAlergiaBody
} from "./interfaces/alergia/alergia.interface.js";