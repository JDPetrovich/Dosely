import { useState, useEffect } from "react";
import { Header } from "@/components/header/header";

import type { UsuarioFormInput, UsuarioFormOutput } from "@/schema/usuario.schema";
import { AddPacienteCard } from "@/components/paciente/card/addPacienteCard";
import { PacienteCard } from "@/components/paciente/card/pacienteCard";
import { CreatePacienteModal } from "@/components/paciente/modal/createPacienteModal";
import { ConfirmModal } from "@/components/paciente/modal/confirmModal";
import { FichaPaciente } from "@/components/paciente/modal/ficha/fichaPaciente";

export default function Principal() {
    const [open, setOpen] = useState(false);
    const [openFicha, setOpenFicha] = useState(false);
    const [pacientes, setPacientes] = useState<UsuarioFormInput[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<UsuarioFormInput | null>(null);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [deletar, setDeletar] = useState(false);

    const carregarPacientes = async () => {
        const respostaIpc = await window.ipc.buscarUsuarios();

        if (respostaIpc.sucesso) {
            setPacientes(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    };

    const criarEditarPaciente = async (data: UsuarioFormOutput) => {

        let respostaIpc;

        if (selectedPaciente?.sequsuario) {
            respostaIpc = await window.ipc.atualizarUsuario({
                ...data,
                sequsuario: selectedPaciente.sequsuario
            });
        } else {
            respostaIpc = await window.ipc.criarUsuario(data);
        }

        if (respostaIpc.sucesso) {
            carregarPacientes();
            setOpen(false);
            setSelectedPaciente(null);
        } else {
            alert("Erro ao criar paciente: " + respostaIpc.mensagem);
        }
    }

    const deletarPaciente = async () => {
        if (!selectedPaciente) return;

        try {
            setDeletar(true);
            const respostaIpc = await window.ipc.deletarUsuario(selectedPaciente.sequsuario!);

            if (respostaIpc.sucesso) {
                setPacientes((prev) => prev.filter((p) => p.sequsuario !== selectedPaciente.sequsuario));
                setModalConfirm(false);
            } else {
                alert("Erro ao excluir paciente: " + respostaIpc.mensagem);
            }
        } catch (error) {
            console.error("Erro na comunicação IPC:", error);
        } finally {
            setDeletar(false);
            setSelectedPaciente(null);
        }

    }

    useEffect(() => {
        carregarPacientes();
    }, []);

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

                            {pacientes.map((p, index) => (
                                <PacienteCard
                                    key={index}
                                    nome={p.nomeusuario}
                                    dtnascimentousuario={p.dtnascimentousuario}
                                    cpf={p.cpfusuario}
                                    onClick={() => {
                                        setSelectedPaciente(p);
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
                        Tem certeza que deseja excluir o(a) paciente <strong>{selectedPaciente?.nomeusuario}</strong>? Essa ação não pode ser desfeita.
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
