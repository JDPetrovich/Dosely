import { HeaderLateral } from "@/components/header/headerLateral"
import { ConfirmModal } from "@/components/paciente/modal/confirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Package } from "lucide-react";
import type { IMedicamento } from "@dosely/shared";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

const FORM_VAZIO = { nome: "", descricao: "", dosagem: "" };

export default function Remedio() {
    const [medicamentos, setMedicamentos] = useState<IMedicamento[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editando, setEditando] = useState<IMedicamento | null>(null);
    const [form, setForm] = useState(FORM_VAZIO);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState<IMedicamento | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const carregarMedicamentos = async () => {
        const respostaIpc = await window.api.medicamentos.buscar();

        if (respostaIpc.sucesso) {
            setMedicamentos(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }

    const abrirNovo = () => {
        setEditando(null);
        setForm(FORM_VAZIO);
        setDialogOpen(true);
    }

    const abrirEdicao = (medicamento: IMedicamento) => {
        setEditando(medicamento);
        setForm({
            nome: medicamento.nome,
            descricao: medicamento.descricao,
            dosagem: medicamento.dosagem,
        });
        setDialogOpen(true);
    }

    const salvar = async () => {
        setSalvando(true);

        const resposta = editando
            ? await window.api.medicamentos.atualizar(editando.seqmedicamento, form)
            : await window.api.medicamentos.criar(form);

        setSalvando(false);

        if (resposta.sucesso) {
            setDialogOpen(false);
            carregarMedicamentos();
        } else {
            console.error("Erro ao salvar medicamento:", resposta.mensagem);
        }
    }

    const confirmarExclusao = async () => {
        if (!excluindo?.seqmedicamento) return;

        setLoadingDelete(true);
        const resposta = await window.api.medicamentos.deletar(excluindo.seqmedicamento);
        setLoadingDelete(false);

        if (resposta.sucesso) {
            setExcluindo(null);
            carregarMedicamentos();
        } else {
            console.error("Erro ao deletar medicamento:", resposta.mensagem);
        }
    }

    useEffect(() => {
        carregarMedicamentos();
    }, []);

    return (
        <div className="h-screen flex flex-col text-gray-800 overflow-hidden">
            <SidebarProvider>
                <HeaderLateral />
                <main className="flex-1 flex flex-col items-center gap-6 p-8 overflow-hidden">
                <div className="w-full max-w-4xl flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Medicamentos</h1>
                        <p className="text-slate-500 mt-1">Gerencie o catálogo de medicamentos disponíveis</p>
                    </div>
                    <Button onClick={abrirNovo}>
                        <Plus className="h-4 w-4 mr-1" />
                        Novo medicamento
                    </Button>
                </div>

                <div className="w-full max-w-4xl">
                    {medicamentos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 mb-4">
                                <Package className="h-12 w-12 mx-auto" />
                            </div>
                            <p className="text-slate-500 mb-4">Nenhum medicamento cadastrado.</p>
                            <Button onClick={abrirNovo}>
                                <Plus className="h-4 w-4 mr-1" />
                                Criar primeiro medicamento
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {medicamentos.map((medicamento) => (
                                <div key={medicamento.seqmedicamento} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg">{medicamento.nome}</p>
                                            <p className="text-sm text-gray-600 mt-1">{medicamento.descricao}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" onClick={() => abrirEdicao(medicamento)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-red-600" onClick={() => setExcluindo(medicamento)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{medicamento.dosagem}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editando ? "Editar medicamento" : "Novo medicamento"}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nome</label>
                                <Input
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    placeholder="Ex: Paracetamol"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Descrição</label>
                                <Input
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    placeholder="Ex: Analgésico"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Dosagem</label>
                                <Input
                                    value={form.dosagem}
                                    onChange={(e) => setForm({ ...form, dosagem: e.target.value })}
                                    placeholder="Ex: 500mg"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={salvar} disabled={salvando || !form.nome.trim()}>
                                {salvando ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <ConfirmModal
                    open={excluindo !== null}
                    onOpenChange={(open) => !open && setExcluindo(null)}
                    onConfirm={confirmarExclusao}
                    loading={loadingDelete}
                    title="Confirmar Exclusão"
                    description={(
                        <span>
                            Tem certeza que deseja excluir o medicamento <strong>{excluindo?.nome}</strong>?
                        </span>
                    )}
                />
            </main>
            </SidebarProvider>
        </div>
    );
}