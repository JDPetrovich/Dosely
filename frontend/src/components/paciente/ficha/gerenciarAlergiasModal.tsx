import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";
import type { IAlergia, IAlergiaPaciente } from "@dosely/shared";
import { usePaciente } from "@/contexts/paciente.context";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved?: () => void;
}

export function GerenciarAlergiasModal({ open, onOpenChange, onSaved }: Props) {
    const { paciente } = usePaciente();
    const [catalogo, setCatalogo] = useState<IAlergia[]>([]);
    const [associadas, setAssociadas] = useState<Set<number>>(new Set());
    const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
    const [busca, setBusca] = useState("");
    const [novaAlergia, setNovaAlergia] = useState("");
    const [salvando, setSalvando] = useState(false);

    const carregar = async () => {
        if (!paciente?.seqpaciente) return;

        const [resCatalogo, resPaciente] = await Promise.all([
            window.api.alergias.buscar(),
            window.api.alergiasPaciente.buscar(paciente.seqpaciente),
        ]);

        if (resCatalogo.sucesso) setCatalogo(resCatalogo.dados);
        if (resPaciente.sucesso) {
            const ids = new Set(resPaciente.dados.map((a: IAlergiaPaciente) => a.seqalergia));
            setAssociadas(ids);
            setSelecionadas(new Set(ids));
        }
    };

    useEffect(() => {
        if (open) {
            setBusca("");
            setNovaAlergia("");
            carregar();
        }
    }, [open, paciente?.seqpaciente]);

    const toggle = (seqalergia: number) => {
        setSelecionadas(prev => {
            const novo = new Set(prev);
            novo.has(seqalergia) ? novo.delete(seqalergia) : novo.add(seqalergia);
            return novo;
        });
    };

    const criarAlergia = async () => {
        const descricao = novaAlergia.trim();
        if (!descricao) return;

        const res = await window.api.alergias.criar(descricao);
        if (res.sucesso) {
            await carregar();
            const resCatalogo = await window.api.alergias.buscar();
            if (resCatalogo.sucesso) {
                const achada = resCatalogo.dados.find((a: IAlergia) => a.descricao === descricao);
                if (achada?.seqalergia) {
                    setSelecionadas(prev => new Set(prev).add(achada.seqalergia));
                }
                setCatalogo(resCatalogo.dados);
            }
        }
        setNovaAlergia("");
    };

    const salvar = async () => {
        if (!paciente?.seqpaciente) return;
        setSalvando(true);

        const paraAssociar = [...selecionadas].filter(id => !associadas.has(id));
        const paraRemover = [...associadas].filter(id => !selecionadas.has(id));

        for (const id of paraAssociar) {
            await window.api.alergiasPaciente.associar(paciente.seqpaciente, id);
        }
        for (const id of paraRemover) {
            await window.api.alergiasPaciente.desassociar(paciente.seqpaciente, id);
        }

        setSalvando(false);
        onSaved?.();
        onOpenChange(false);
    };

    const filtradas = catalogo.filter(a =>
        a.descricao.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Alergias de {paciente?.nome}</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2">
                    <Input
                        placeholder="Buscar alergia..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Nova alergia..."
                        value={novaAlergia}
                        onChange={e => setNovaAlergia(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && criarAlergia()}
                    />
                    <Button variant="outline" size="icon" onClick={criarAlergia}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                    {filtradas.map(alergia => {
                        const marcada = selecionadas.has(alergia.seqalergia);
                        return (
                            <button
                                key={alergia.seqalergia}
                                type="button"
                                onClick={() => toggle(alergia.seqalergia)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-sm transition-colors
                                    ${marcada ? "border-red-300 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}
                            >
                                <span>{alergia.descricao}</span>
                                {marcada && <Check className="h-4 w-4 text-red-600" />}
                            </button>
                        );
                    })}
                    {filtradas.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Nenhuma alergia encontrada.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={salvar} disabled={salvando}>
                        {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}