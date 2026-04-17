Objetivo: implementar gestão de alergias de paciente com UX limpa e separação correta de responsabilidades.

Estrutura:

1. Card (Alergias & Restrições)

* Exibe lista de alergias do paciente (badges)
* Botão (engrenagem) abre modal de gerenciamento

2. Modal principal (contexto do paciente)

* Lista todas alergias disponíveis (checkbox ou multi-select)
* Permite selecionar/desmarcar alergias do paciente
* Campo de busca (opcional mas recomendado)
* Botão "+ Nova alergia"
* Botão "Salvar" para persistir associação

3. Criação rápida (modal secundário ou inline)

* Ao clicar "+ Nova alergia", abrir modal pequeno ou input inline
* Criar nova alergia (nome)
* Após criar:

  * adicionar na lista local
  * já marcar como selecionada automaticamente

4. Tela separada (CRUD completo de alergias)

* Listar todas alergias
* Criar, editar, remover
* Usada para manutenção global do sistema
* NÃO misturar com fluxo do paciente

Regras importantes:

* Modal principal = apenas associação (Paciente ↔ Alergia)
* Evitar editar/deletar alergias dentro do modal principal
* Sempre atualizar estado após salvar (ou recarregar dados)
* UX deve ser rápida e contextual (sem navegação desnecessária)

Resumo mental:
Paciente → modal
Sistema (catálogo) → tela
