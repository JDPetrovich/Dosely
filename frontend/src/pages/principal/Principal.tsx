import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header/header";

import type { PacienteFormInput, PacienteFormOutput } from "@/schema/paciente.schema";
import { AddPacienteCard } from "@/components/paciente/card/addPacienteCard";
import { PacienteCard } from "@/components/paciente/card/pacienteCard";
import { CreatePacienteModal } from "@/components/paciente/modal/createPacienteModal";
import { ConfirmModal } from "@/components/paciente/modal/confirmModal";
import { usePaciente } from "@/contexts/paciente.context";
import { FichaPaciente } from "@/components/paciente/ficha/fichaPaciente";

export default function Principal() {
    const [open, setOpen] = useState(false);
    const [openFicha, setOpenFicha] = useState(false);
    const [pacientes, setPacientes] = useState<PacienteFormInput[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteFormInput | null>(null);
    const { setPaciente } = usePaciente();
    const [modalConfirm, setModalConfirm] = useState(false);
    const [deletar, setDeletar] = useState(false);

    const carregarPacientes = useCallback(async () => {
        const respostaIpc = await window.api.pacientes.buscar();

        if (respostaIpc.sucesso) {
            setPacientes(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }, []);

    const criarPaciente = async (data: PacienteFormOutput) => {
        const resposta = await window.api.pacientes.criar(data);

        if (!resposta.sucesso) {
            alert("Erro ao criar paciente: " + resposta.mensagem);
            return;
        }

        await carregarPacientes();
    };

    const editarPaciente = async (data: PacienteFormOutput) => {
        if (!selectedPaciente?.seqpaciente) return;

        const resposta = await window.api.pacientes.atualizar({
            ...data,
            seqpaciente: selectedPaciente.seqpaciente
        });

        if (!resposta.sucesso) {
            alert("Erro ao atualizar paciente: " + resposta.mensagem);
            return;
        }

        await carregarPacientes();
    };

    const criarEditarPaciente = async (data: PacienteFormOutput) => {
        try {
            if (selectedPaciente?.seqpaciente) {
                await editarPaciente(data);
            } else {
                await criarPaciente(data);
            }

            setOpen(false);
            setSelectedPaciente(null);
        } catch (err) {
            console.error(err);
        }
    };

    const deletarPaciente = async () => {
        if (!selectedPaciente) return;

        setDeletar(true);

        try {
            const resposta = await window.api.pacientes.deletar(
                selectedPaciente.seqpaciente!,
                selectedPaciente.codpaciente
            );

            if (!resposta.sucesso) {
                alert("Erro ao excluir paciente: " + resposta.mensagem);
                setModalConfirm(false);
                return;
            }

            setPacientes(prev =>
                prev.filter(p => p.seqpaciente !== selectedPaciente.seqpaciente)
            );

            setModalConfirm(false);

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
            <Header />

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
                                    nome={p.nomepaciente}
                                    dtnascimentopaciente={p.dtnascimentopaciente}
                                    cpf={p.cpfpaciente}
                                    onClick={() => {
                                        setSelectedPaciente(p);
                                        setPaciente(p.seqpaciente ? { seqpaciente: p.seqpaciente, nompaciente: p.nomepaciente } : null);
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
                        Tem certeza que deseja excluir o(a) paciente <strong>{selectedPaciente?.nomepaciente}</strong>? Essa ação não pode ser desfeita.
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

        </div>
    );
}
