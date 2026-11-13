import { HeaderLateral } from "@/components/header/headerLateral"
import { ConfirmModal } from "@/components/paciente/modal/confirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2, AlertTriangle } from "lucide-react";
import type { IAlergia } from "@dosely/shared";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Alergia() {
    const [alergias, setAlergias] = useState<IAlergia[]>([]);
    const [novaDescricao, setNovaDescricao] = useState("");
    const [editando, setEditando] = useState<number | null>(null);
    const [descricaoEdicao, setDescricaoEdicao] = useState("");
    const [excluindo, setExcluindo] = useState<IAlergia | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const carregarAlergias = async () => {
        const respostaIpc = await window.api.alergias.buscar();

        if (respostaIpc.sucesso) {
            setAlergias(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }

    const criarAlergia = async () => {
        const descricao = novaDescricao.trim();
        if (!descricao) return;

        const resposta = await window.api.alergias.criar(descricao);

        if (resposta.sucesso) {
            setNovaDescricao("");
            carregarAlergias();
        } else {
            console.error("Erro ao criar alergia:", resposta.mensagem);
        }
    }

    const salvarEdicao = async (seqalergia: number) => {
        const descricao = descricaoEdicao.trim();
        if (!descricao) return;

        const resposta = await window.api.alergias.atualizar(seqalergia, descricao);

        if (resposta.sucesso) {
            setEditando(null);
            carregarAlergias();
        } else {
            console.error("Erro ao atualizar alergia:", resposta.mensagem);
        }
    }

    const confirmarExclusao = async () => {
        if (!excluindo?.seqalergia) return;

        setLoadingDelete(true);
        const resposta = await window.api.alergias.deletar(excluindo.seqalergia);
        setLoadingDelete(false);

        if (resposta.sucesso) {
            setExcluindo(null);
            carregarAlergias();
        } else {
            console.error("Erro ao deletar alergia:", resposta.mensagem);
        }
    }

    useEffect(() => {
        carregarAlergias();
    }, []);

    return (
        <div className="h-screen flex flex-col text-gray-800 overflow-hidden">
            <SidebarProvider>
                <HeaderLateral />
                <main className="flex-1 flex flex-col items-center gap-6 p-8 overflow-hidden">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl font-bold text-slate-800">Alergias</h1>
                    <p className="text-slate-500 mt-1">Gerencie o catálogo de alergias disponíveis</p>
                </div>

                <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Nova alergia..."
                            value={novaDescricao}
                            onChange={(e) => setNovaDescricao(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && criarAlergia()}
                            className="flex-1"
                        />
                        <Button onClick={criarAlergia} disabled={!novaDescricao.trim()}>
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                        </Button>
                    </div>

                    {alergias.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 mb-4">
                                <AlertTriangle className="h-12 w-12 mx-auto" />
                            </div>
                            <p className="text-slate-500 mb-4">Nenhuma alergia cadastrada.</p>
                            <Button onClick={() => document.querySelector('input')?.focus()}>
                                <Plus className="h-4 w-4 mr-1" />
                                Criar primeira alergia
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {alergias.map((alergia) => (
                                <div key={alergia.seqalergia} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    {editando === alergia.seqalergia ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={descricaoEdicao}
                                                onChange={(e) => setDescricaoEdicao(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") salvarEdicao(alergia.seqalergia);
                                                    if (e.key === "Escape") setEditando(null);
                                                }}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => salvarEdicao(alergia.seqalergia)} className="flex-1">Salvar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditando(null)}>Cancelar</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg">{alergia.descricao}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setEditando(alergia.seqalergia);
                                                        setDescricaoEdicao(alergia.descricao);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => setExcluindo(alergia)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <ConfirmModal
                    open={excluindo !== null}
                    onOpenChange={(open) => !open && setExcluindo(null)}
                    onConfirm={confirmarExclusao}
                    loading={loadingDelete}
                    title="Confirmar Exclusão"
                    description={(
                        <span>
                            Tem certeza que deseja excluir a alergia <strong>{excluindo?.descricao}</strong>?
                            Ela será removida de todos os pacientes vinculados.
                        </span>
                    )}
                />
            </main>
            </SidebarProvider>
        </div>
    );
}