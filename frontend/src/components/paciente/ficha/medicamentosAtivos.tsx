import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Pill,
    Plus,
    Trash2,
    Clock,
    CalendarDays,
    Package,
    CalendarRange,
    CalendarCheck,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { usePaciente } from "@/contexts/paciente.context";

interface MedicamentoPacienteFlat {
    seqmedicamentopaciente: number;
    tipo_registro: "unitario" | "combo";
    nome_principal: string | null;
    dosagem_principal: string | null;
    stock: number;
    tipohorario: "exact" | "interval";
    horario: string;
    tipoperiodo: "continuous" | "specific";
    periodo: string;
    item_nome: string | null;
    item_dosagem: string | null;
}

interface Medicamento {
    id: number;
    nome: string;
    dosagem: string;
    ativo: boolean;
    tipo: "unitario" | "combo";
    stock: number;
    tipohorario: string;
    horario: any;
    tipoperiodo: string;
    periodo: any;
    itensCombo?: Omit<Medicamento, "itensCombo">[];
}

interface MedicamentosAtivosProps {
    // removi a prop dados, pois a busca é interna
    onAdicionarRemedio?: () => void;
    onAdicionarCombo?: () => void;
    onRemoverMedicamento?: (id: number) => void;
    onAdicionarItemNoCombo?: (comboId: number, novoItem: Omit<Medicamento, "id">) => void;
    onRemoverItemDoCombo?: (comboId: number, itemId: number) => void;
    onSalvarAlteracoes?: () => void;
    onVerCalendario?: () => void;
    onExportarRelatorio?: () => void;
}

export function MedicamentosAtivos({
    onAdicionarRemedio,
    onAdicionarCombo,
    onRemoverMedicamento,
    onAdicionarItemNoCombo,
    onRemoverItemDoCombo,
    onSalvarAlteracoes,
    onVerCalendario,
    onExportarRelatorio,
}: MedicamentosAtivosProps) {
    const [filtro, setFiltro] = useState<"todos" | "unitario" | "combo">("todos");
    const [isExactTime, setIsExactTime] = useState(true);
    const [isContinuous, setIsContinuous] = useState(false);
    const { paciente } = usePaciente();

    const [medicamentos, setMedicamentos] = useState<MedicamentoPacienteFlat[]>([]);

    const carregarMedicamentos = async (seqpaciente: number) => {
        const respostaIpc = await window.api.medicamentosPaciente.buscar(seqpaciente);
        if (respostaIpc.sucesso) {
            setMedicamentos(respostaIpc.dados);
        } else {
            console.error('Erro IPC:', respostaIpc.mensagem);
        }
    };

    useEffect(() => {
        if (paciente?.seqpaciente) {
            carregarMedicamentos(paciente.seqpaciente);
        }
    }, [paciente?.seqpaciente]);

    const medicamento = useMemo(() => {
        const map = new Map<number, Medicamento>();

        for (const item of medicamentos) {
            const id = item.seqmedicamentopaciente;

            if (!map.has(id)) {
                map.set(id, {
                    id: id,
                    nome: item.nome_principal || `Combo ${id}`,
                    dosagem: item.dosagem_principal || "",
                    ativo: true,
                    tipo: item.tipo_registro,
                    stock: item.stock,
                    tipohorario: item.tipohorario,
                    horario: JSON.parse(item.horario),
                    tipoperiodo: item.tipoperiodo,
                    periodo: JSON.parse(item.periodo),
                    itensCombo: [],
                });
            }

            if (item.tipo_registro === "combo" && item.item_nome) {
                const combo = map.get(id)!;
                combo.itensCombo!.push({
                    id: id * 1000 + (combo.itensCombo?.length ?? 0),
                    nome: item.item_nome,
                    dosagem: item.item_dosagem || "",
                    ativo: true,
                    tipo: "unitario",
                    stock: 0,
                    tipohorario: combo.tipohorario,
                    horario: combo.horario,
                    tipoperiodo: combo.tipoperiodo,
                    periodo: combo.periodo,
                });
            }
        }

        return Array.from(map.values());
    }, [medicamentos]);

    const medicamentosFiltrados = medicamento.filter((med) => {
        if (filtro === "todos") return true;
        return med.tipo === filtro;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Medicamentos em Uso
                </h3>
                <div className="flex gap-2">
                    <Button onClick={onAdicionarRemedio} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Remédio
                    </Button>
                    <Button onClick={onAdicionarCombo} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Combo
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={filtro === "todos" ? "default" : "outline"}
                    onClick={() => setFiltro("todos")}
                >
                    Todos
                </Button>
                <Button
                    variant={filtro === "unitario" ? "default" : "outline"}
                    onClick={() => setFiltro("unitario")}
                >
                    Unitários
                </Button>
                <Button
                    variant={filtro === "combo" ? "default" : "outline"}
                    onClick={() => setFiltro("combo")}
                >
                    Combos
                </Button>
            </div>

            {/* LISTA */}
            <div className="space-y-4">
                {medicamentosFiltrados.map((med) => (
                    <Card key={med.id} className="border hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* HEADER */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Pill className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {med.nome}
                                            </h4>
                                            {med.tipo === "combo" ? (
                                                <p className="text-sm text-gray-500">
                                                    Combo de medicamentos
                                                </p>
                                            ) : (
                                                <p className="text-gray-600">
                                                    Dosagem: {med.dosagem}
                                                </p>
                                            )}
                                        </div>
                                        <Badge
                                            variant={med.ativo ? "default" : "outline"}
                                            className={med.ativo ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {med.ativo ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </div>

                                    {/* COMBO EDITÁVEL */}
                                    {med.tipo === "combo" && (
                                        <div className="mt-4 p-3 border rounded bg-gray-50">
                                            <p className="text-xs text-gray-500 mb-2">
                                                Medicamentos do combo:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {med.itensCombo?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
                                                    >
                                                        <span className="text-sm">
                                                            {item.nome} {item.dosagem}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                onRemoverItemDoCombo?.(med.id, item.id)
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const novoItem = {
                                                            nome: "Novo Remédio",
                                                            dosagem: "0mg",
                                                            ativo: true,
                                                            tipo: "unitario" as const,
                                                            stock: 0,
                                                            tipohorario: med.tipohorario,
                                                            horario: med.horario,
                                                            tipoperiodo: med.tipoperiodo,
                                                            periodo: med.periodo,
                                                        };
                                                        onAdicionarItemNoCombo?.(med.id, novoItem);
                                                    }}
                                                    className="px-2 py-1 border border-dashed rounded text-sm hover:bg-gray-100"
                                                >
                                                    + Adicionar
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* HORÁRIO + PERÍODO */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">Tipo de Horário</span>
                                                </div>
                                                <Switch
                                                    checked={!isExactTime}
                                                    onCheckedChange={(checked) => setIsExactTime(!checked)}
                                                />
                                            </div>
                                            {isExactTime ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(med.horario) && med.horario.map((h: string) => (
                                                        <Badge key={h} variant="outline">{h}</Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={typeof med.horario === 'object' ? med.horario.hours : 8}
                                                        className="w-16 border rounded px-2"
                                                    />
                                                    <span>horas</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">Período</span>
                                                </div>
                                                <Switch
                                                    checked={isContinuous}
                                                    onCheckedChange={setIsContinuous}
                                                />
                                            </div>
                                            {isContinuous ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={med.periodo.days || 30}
                                                        className="w-20 border rounded px-2"
                                                    />
                                                    <span>dias</span>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <CalendarRange className="h-4 w-4" />
                                                    <span className="text-sm text-gray-500">
                                                        {Array.isArray(med.periodo) ? med.periodo.join(", ") : "Datas específicas"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ESTOQUE */}
                                    <div className="mt-6 flex gap-2 items-center">
                                        <Package className="h-4 w-4 text-gray-500" />
                                        <input
                                            type="number"
                                            defaultValue={med.stock}
                                            className="w-20 border rounded px-2"
                                        />
                                        <span>unidades</span>
                                    </div>
                                </div>

                                {/* REMOVER */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemoverMedicamento?.(med.id)}
                                    className="ml-2 text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between pt-4">
                <Button onClick={onVerCalendario} variant="outline">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Ver Calendário
                </Button>
                <div className="flex gap-3">
                    <Button onClick={onExportarRelatorio} variant="outline">
                        Exportar
                    </Button>
                    <Button onClick={onSalvarAlteracoes} className="bg-green-600 hover:bg-green-700">
                        Salvar
                    </Button>
                </div>
            </div>
        </div>
    );
}