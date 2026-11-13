import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pill, Plus, Trash2, Clock, CalendarDays, Package, CalendarRange, CalendarCheck, } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { usePaciente } from "@/contexts/paciente.context";
import type { ITratamentoDetalhado, ITratamentoItemDetalhado, } from "@dosely/shared";
import { CreateTratamentoModal } from "../modal/createTratamentoModal";

interface MedicamentoVisual {
    id: number;
    nome: string;
    dosagem: string;
    ativo: boolean;
    tipo: "unitario" | "combo";
    estoque: number;
    tipoHorario: "EXATO" | "INTERVALO";
    horarios: string[];
    horarioInicio: string | null;
    intervaloHoras: number | null;
    dataInicio: string;
    dataFim: string | null;
    tipoRepeticao: "DIARIA" | "A_CADA_DIAS";
    intervaloDias: number | null;
    itensCombo: ITratamentoItemDetalhado[];
}

interface MedicamentosAtivosProps {
    onAdicionarRemedio?: () => void;
    onAdicionarCombo?: () => void;
    onRemoverMedicamento?: (id: number) => void;
    onAdicionarItemNoCombo?: (
        comboId: number,
        novoItem: {
            nome: string;
            dosagem: string;
            estoque: number;
        }
    ) => void;
    onRemoverItemDoCombo?: (
        comboId: number,
        itemId: number
    ) => void;
    onSalvarAlteracoes?: () => void;
    onVerCalendario?: () => void;
    onExportarRelatorio?: () => void;
}

function formatarData(data: string) {
    return data.split("-").reverse().join("/");
}

export function MedicamentosAtivos({
    onRemoverMedicamento,
    onAdicionarItemNoCombo,
    onRemoverItemDoCombo,
    onSalvarAlteracoes,
    onVerCalendario,
    onExportarRelatorio,
}: MedicamentosAtivosProps) {
    const [filtro, setFiltro] = useState<"todos" | "unitario" | "combo">("todos");
    const { paciente } = usePaciente();
    const [tratamentos, setTratamentos] = useState<ITratamentoDetalhado[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [tipoModal, setTipoModal] = useState<"unitario" | "combo">("unitario");
    const [erro, setErro] = useState("");

    const carregarMedicamentos = async (
        seqpaciente: number
    ) => {
        const respostaIpc =
            await window.api.tratamentosPaciente.buscar(
                seqpaciente
            );

        if (respostaIpc.sucesso) {
            setTratamentos(respostaIpc.dados ?? []);
            setErro("");
            return;
        }

        setTratamentos([]);
        setErro(
            respostaIpc.mensagem ??
            "Erro ao carregar tratamentos."
        );
    };

    function abrirModal(tipo: "unitario" | "combo") {
        setTipoModal(tipo);
        setModalAberto(true);
    }

    useEffect(() => {
        if (paciente?.seqpaciente) {
            carregarMedicamentos(paciente.seqpaciente);
            return;
        }

        setTratamentos([]);
    }, [paciente?.seqpaciente]);

    const medicamentos = useMemo<MedicamentoVisual[]>(() => {
        return tratamentos.map((tratamento) => {
            const itemPrincipal = tratamento.itens[0];
            const ehCombo = tratamento.itens.length > 1;

            return {
                id: tratamento.seqtratamento,
                nome: ehCombo
                    ? `Combo ${tratamento.seqtratamento}`
                    : itemPrincipal?.nome ?? "Tratamento sem medicamento",
                dosagem: itemPrincipal?.dosagem ?? "",
                ativo: tratamento.ativo,
                tipo: ehCombo ? "combo" : "unitario",
                estoque: itemPrincipal?.estoque ?? 0,
                tipoHorario: tratamento.tipo_horario,
                horarios: tratamento.horarios.map(
                    ({ horario }) => horario
                ),
                horarioInicio: tratamento.horario_inicio,
                intervaloHoras: tratamento.intervalo_horas,
                dataInicio: tratamento.data_inicio,
                dataFim: tratamento.data_fim,
                tipoRepeticao: tratamento.tipo_repeticao,
                intervaloDias: tratamento.intervalo_dias,
                itensCombo: tratamento.itens,
            };
        });
    }, [tratamentos]);

    const medicamentosFiltrados = medicamentos.filter((med) => {
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
                    <Button
                        onClick={() => abrirModal("unitario")}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Remédio
                    </Button>

                    <Button
                        onClick={() => abrirModal("combo")}
                        variant="outline"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Combo
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={
                        filtro === "todos"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setFiltro("todos")}
                >
                    Todos
                </Button>

                <Button
                    variant={
                        filtro === "unitario"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setFiltro("unitario")}
                >
                    Unitários
                </Button>

                <Button
                    variant={
                        filtro === "combo"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setFiltro("combo")}
                >
                    Combos
                </Button>
            </div>

            {erro && (
                <p className="text-sm text-red-500">
                    {erro}
                </p>
            )}

            <div className="space-y-4">
                {medicamentosFiltrados.map((med) => {
                    const isExactTime =
                        med.tipoHorario === "EXATO";

                    const isContinuous =
                        med.dataFim === null;

                    return (
                        <Card
                            key={med.id}
                            className="border hover:border-blue-300 transition-colors"
                        >
                            <CardContent className="">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                                <Pill className="h-5 w-5 text-blue-600" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">

                                                    <h4 className="font-semibold text-gray-900">
                                                        {med.nome}
                                                    </h4>

                                                    <Badge
                                                        variant={
                                                            med.ativo
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className={
                                                            med.ativo
                                                                ? "bg-green-100 text-green-800"
                                                                : ""
                                                        }
                                                    >
                                                        {med.ativo
                                                            ? "Ativo"
                                                            : "Inativo"}
                                                    </Badge>
                                                </div>

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
                                        </div>

                                        {med.tipo === "combo" && (
                                            <div className="mt-1 p-2 border rounded bg-gray-50">
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Medicamentos do combo:
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {med.itensCombo.map(
                                                        (item) => (
                                                            <div
                                                                key={
                                                                    item.seqtratamentoitem
                                                                }
                                                                className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
                                                            >
                                                                <span className="text-sm">
                                                                    {item.nome}{" "}
                                                                    {item.dosagem}
                                                                </span>

                                                                <button
                                                                    onClick={() =>
                                                                        onRemoverItemDoCombo?.(
                                                                            med.id,
                                                                            item.seqtratamentoitem
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        )
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            onAdicionarItemNoCombo?.(
                                                                med.id,
                                                                {
                                                                    nome: "Novo Remédio",
                                                                    dosagem: "0mg",
                                                                    estoque: 0,
                                                                }
                                                            )
                                                        }
                                                        className="px-2 py-1 border border-dashed rounded text-sm hover:bg-gray-100"
                                                    >
                                                        + Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">
                                                            Tipo de Horário
                                                        </span>
                                                    </div>

                                                    <Switch
                                                        checked={!isExactTime}
                                                        onCheckedChange={() => undefined}
                                                    />
                                                </div>

                                                {isExactTime ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {med.horarios.map(
                                                            (horario) => (
                                                                <Badge
                                                                    key={
                                                                        horario
                                                                    }
                                                                    variant="outline"
                                                                >
                                                                    {horario}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-1.5 items-center">
                                                        <input
                                                            type="number"
                                                            value={
                                                                med.intervaloHoras ??
                                                                0
                                                            }
                                                            readOnly
                                                            className="w-16 border rounded px-2"
                                                        />

                                                        <span>
                                                            horas, a partir de{" "}
                                                            {med.horarioInicio}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">
                                                            Período
                                                        </span>
                                                    </div>

                                                    <Switch
                                                        checked={isContinuous}
                                                        onCheckedChange={() => undefined}
                                                    />
                                                </div>

                                                {isContinuous ? (
                                                    <div className="flex gap-1.5">
                                                        <span className="text-sm text-gray-500">
                                                            Contínuo desde{" "}
                                                            {formatarData(
                                                                med.dataInicio
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-1.5">
                                                        <CalendarRange className="h-4 w-4" />

                                                        <span className="text-sm text-gray-500">
                                                            {formatarData(
                                                                med.dataInicio
                                                            )}{" "}
                                                            até{" "}
                                                            {formatarData(
                                                                med.dataFim!
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {med.tipoRepeticao ===
                                            "A_CADA_DIAS" && (
                                                <div className="mt-4 text-sm text-gray-600">
                                                    Repetir a cada{" "}
                                                    {med.intervaloDias} dia(s)
                                                </div>
                                            )}

                                        {med.tipo === "unitario" && (
                                            <div className="mt-3 flex gap-1.5 items-center">
                                                <Package className="h-4 w-4 text-gray-500" />

                                                <input
                                                    type="number"
                                                    value={med.estoque}
                                                    readOnly
                                                    className="w-20 border rounded px-2"
                                                />

                                                <span>unidades</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            onRemoverMedicamento?.(
                                                med.id
                                            )
                                        }
                                        className="ml-2 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-between">
                <Button
                    onClick={onVerCalendario}
                    variant="outline"
                >
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Ver Calendário
                </Button>

                <div className="flex gap-3">
                    <Button
                        onClick={onExportarRelatorio}
                        variant="outline"
                    >
                        Exportar
                    </Button>

                    <Button
                        onClick={onSalvarAlteracoes}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Salvar
                    </Button>
                </div>
            </div>

            {paciente?.seqpaciente && (
                <CreateTratamentoModal
                    open={modalAberto}
                    onOpenChange={setModalAberto}
                    tipo={tipoModal}
                    seqpaciente={paciente.seqpaciente}
                    onCreated={() =>
                        carregarMedicamentos(paciente.seqpaciente)
                    }
                />
            )}
        </div>
    );
}