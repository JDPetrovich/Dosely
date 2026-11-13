import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header/header";
import { HeaderLateral } from "@/components/header/headerLateral";

import type { PacienteFormInput, PacienteFormOutput } from "@/schema/paciente.schema";
import { AddPacienteCard } from "@/components/paciente/card/addPacienteCard";
import { PacienteCard } from "@/components/paciente/card/pacienteCard";
import { CreatePacienteModal } from "@/components/paciente/modal/createPacienteModal";
import { ConfirmModal } from "@/components/paciente/modal/confirmModal";
import { usePaciente } from "@/contexts/paciente.context";
import { FichaPaciente } from "@/components/paciente/ficha/fichaPaciente";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Principal() {
    const [open, setOpen] = useState(false);
    const [openFicha, setOpenFicha] = useState(false);
    const [pacientes, setPacientes] = useState<PacienteFormInput[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteFormInput | null>(null);
    const { setPaciente } = usePaciente();
    const [modalConfirm, setModalConfirm] = useState(false);
    const [deletar, setDeletar] = useState(false);
    const [mensagem, setMensagem] = useState<{
        tipo: "sucesso" | "erro";
        texto: string;
    } | null>(null);

    const mostrarMensagem = (
        tipo: "sucesso" | "erro",
        texto: string
    ) => {
        setMensagem({ tipo, texto });

        setTimeout(() => {
            setMensagem(null);
        }, 4000);
    };

    const carregarPacientes = useCallback(async () => {
        const respostaIpc = await window.api.pacientes.buscar();

        if (respostaIpc.sucesso) {
            setPacientes(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }, []);

    const criarPaciente = async (data: PacienteFormOutput): Promise<boolean> => {
        const resposta = await window.api.pacientes.criar(data);

        if (!resposta.sucesso) {
            mostrarMensagem(
                "erro",
                resposta.mensagem || "Erro ao criar paciente."
            );

            return false;
        }

        await carregarPacientes();

        mostrarMensagem(
            "sucesso",
            "Paciente criado com sucesso!"
        );

        return true;
    };

    const editarPaciente = async (data: PacienteFormOutput): Promise<boolean> => {
        if (!selectedPaciente?.seqpaciente) {
            mostrarMensagem("erro", "Paciente não encontrado")
            return false
        };

        const resposta = await window.api.pacientes.atualizar({
            ...data,
            seqpaciente: selectedPaciente.seqpaciente
        });

        if (!resposta.sucesso) {
            mostrarMensagem(
                "erro",
                resposta.mensagem || "Erro ao atualizar paciente."
            );

            return false;
        }

        await carregarPacientes();

        mostrarMensagem(
            "sucesso",
            "Paciente atualizado com sucesso!"
        );

        return true;
    };

    const criarEditarPaciente = async (data: PacienteFormOutput): Promise<boolean> => {
        try {
            let sucesso = false;
            if (selectedPaciente?.seqpaciente) {
                sucesso = await editarPaciente(data);
            } else {
                sucesso = await criarPaciente(data);
            }

            if (!sucesso) {
                return false;
            }

            setOpen(false);
            setSelectedPaciente(null);

            return true;
        } catch (err) {
            console.error(err);

            mostrarMensagem(
                "erro",
                "Ocorreu um erro ao salvar o paciente. Por favor, tente novamente."
            );

            return false;
        }
    };

    const deletarPaciente = async () => {
        if (!selectedPaciente) return;

        setDeletar(true);

        try {
            const resposta = await window.api.pacientes.deletar(
                selectedPaciente.seqpaciente!,
                selectedPaciente.login
            );
            if (!resposta.sucesso) {
                mostrarMensagem(
                    "erro",
                    resposta.mensagem || "Erro ao excluir paciente."
                );

                setModalConfirm(false);
                return;
            }

            setPacientes(prev =>
                prev.filter(p => p.seqpaciente !== selectedPaciente.seqpaciente)
            );

            setModalConfirm(false);

            mostrarMensagem(
                "sucesso",
                "Paciente excluído com sucesso!"
            );

        } catch (error) {
            console.error(error);
        } finally {
            setDeletar(false);
            setSelectedPaciente(null);
        }
    };

    useEffect(() => {
        carregarPacientes();
    }, [carregarPacientes]);

    return (
        <div className="h-screen flex flex-col text-gray-800 overflow-hidden">
            <SidebarProvider>
                <HeaderLateral />

                <main className="flex-1 flex flex-col items-center gap-6 p-6 overflow-hidden">
                    <h1 className="text-3xl font-semibold text-slate-800">
                        Seja bem-vindo
                    </h1>
                    <p className="text-slate-500">
                        Gerencie pacientes e cuidados diários
                    </p>

                    <div className="w-full max-w-7xl flex flex-col rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <h2 className="text-xl font-semibold text-slate-700 px-6 py-2 ">
                            Pacientes
                        </h2>

                        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                                <AddPacienteCard onClick={() => {
                                    setSelectedPaciente(null);
                                    setOpen(true);
                                }} />

                                {pacientes.map((p) => (
                                    <PacienteCard
                                        key={p.seqpaciente}
                                        nome={p.nome}
                                        data_nascimento={p.data_nascimento}
                                        cpf={p.cpf}
                                        onClick={() => {
                                            setSelectedPaciente(p);
                                            setPaciente(p.seqpaciente ? { seqpaciente: p.seqpaciente, nome: p.nome } : null);
                                            setOpenFicha(true);
                                        }}
                                        onEdit={() => {
                                            setSelectedPaciente(p);
                                            setOpen(true);
                                        }}
                                        onDelete={() => {
                                            setSelectedPaciente(p);
                                            setModalConfirm(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <CreatePacienteModal
                    open={open}
                    onOpenChange={setOpen}
                    paciente={selectedPaciente}
                    onSave={criarEditarPaciente}
                />

                <ConfirmModal
                    open={modalConfirm}
                    onOpenChange={setModalConfirm}
                    onConfirm={deletarPaciente}
                    loading={deletar}
                    title="Confirmar Exclusão"
                    description={(
                        <span>
                            Tem certeza que deseja excluir o(a) paciente <strong>{selectedPaciente?.nome}</strong>? Essa ação não pode ser desfeita.
                        </span>
                    )}
                />

                {openFicha && selectedPaciente && (
                    <FichaPaciente
                        open={openFicha}
                        onOpenChange={setOpenFicha}
                        paciente={selectedPaciente}
                        onEdit={() => setOpen(true)}
                    />
                )}

                {mensagem && (
                    <div
                        className={`fixed bottom-6 right-6 z-[100] w-80 rounded-xl
                        border bg-white p-4 shadow-xl animate-in slide-in-from-right-5
                        ${mensagem.tipo === "erro" ? "border-red-200" : "border-emerald-200"}
                    `}>
                        <div className="flex items-start gap-3">
                            <div
                                className={`
                                mt-1 h-2.5 w-2.5 shrink-0 rounded-full
                                ${mensagem.tipo === "erro" ? "bg-red-500" : "bg-emerald-500"}
                            `}
                            />

                            <div>
                                <p className="font-semibold text-gray-800">
                                    {mensagem.tipo === "erro" ? "Ocorreu um erro" : "Sucesso"}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {mensagem.texto}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarProvider>
        </div>
    );
}
