export const MensagemErro = {
    // Erros de recurso não encontrado
    RESOURCE_NOT_FOUND: {
        user: "Usuário não encontrado.",
        product: "Produto não encontrado.",
        medicine: "Remédio não encontrado.",
        order: "Pedido não encontrado.",
    },

    // Erros de validação e dados
    VALIDATION: {
        invalid_data: "Dados inválidos.",
        invalid_email: "E-mail inválido.",
        invalid_phone: "Telefone inválido.",
        invalid_date: "Data inválida.",
        invalid_number: "Número inválido.",
        required_field: "Campo obrigatório não preenchido.",
        field_too_long: "Campo excede o tamanho máximo permitido.",
        field_too_short: "Campo é menor que o tamanho mínimo permitido.",
    },

    // Erros de duplicação
    DUPLICATE: {
        email: "E-mail já cadastrado.",
        phone: "Telefone já cadastrado.",
        cpf: "CPF já cadastrado.",
        username: "Nome de usuário já cadastrado.",
        sku: "SKU do produto já cadastrado.",
    },

    // Erros de permissão
    PERMISSION: {
        denied: "Permissão negada.",
        insufficient_privileges: "Privilégios insuficientes para esta operação.",
        unauthorized: "Não autorizado.",
    },

    // Erros de integridade de dados
    INTEGRITY: {
        foreign_key: "Não é possível executar esta operação devido a relações com outros registros.",
        constraint_violation: "Violação de restrição de integridade.",
    },

    // Erros gerais
    GENERAL: {
        internal_error: "Erro interno do servidor.",
        database_error: "Erro ao acessar o banco de dados.",
        service_unavailable: "Serviço indisponível no momento.",
    },
} as const;

export type ErrorMessageCategory = keyof typeof MensagemErro;
export type ErrorMessage = typeof MensagemErro[ErrorMessageCategory][keyof typeof MensagemErro[ErrorMessageCategory]];