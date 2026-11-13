import { useEffect, useState } from "react";
import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import type { ICriarTratamentoItem, ITratamentoBody, TipoHorario, TipoRepeticao, } from "@dosely/shared";
import type { IMedicamento } from "@dosely/shared";

type ModalTipo = "unitario" | "combo";

interface ItemFormulario extends ICriarTratamentoItem {
    id: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tipo: ModalTipo;
    seqpaciente: number;
    onCreated: () => void;
}

function dataHoje() {
    const data = new Date();

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function novoItem(): ItemFormulario {
    return {
        id: crypto.randomUUID(),
        seqmedicamento: 0,
        quantidade: 1,
        unidade: "comprimido",
        estoque: 0,
    };
}

export function CreateTratamentoModal({
    open,
    onOpenChange,
    tipo,
    seqpaciente,
    onCreated,
}: Props) {
    const [medicamentos, setMedicamentos] = useState<IMedicamento[]>([]);
    const [itens, setItens] = useState<ItemFormulario[]>([novoItem(),]);
    const [dataInicio, setDataInicio] = useState(dataHoje());
    const [dataFim, setDataFim] = useState("");
    const [tipoRepeticao, setTipoRepeticao] = useState<TipoRepeticao>("DIARIA");
    const [intervaloDias, setIntervaloDias] = useState(1);
    const [tipoHorario, setTipoHorario] = useState<TipoHorario>("EXATO");
    const [horarios, setHorarios] = useState(["08:00"]);
    const [novoHorario, setNovoHorario] = useState("12:00");
    const [horarioInicio, setHorarioInicio] = useState("08:00");
    const [intervaloHoras, setIntervaloHoras] = useState(8);
    const [ativo, setAtivo] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!open) return;

        async function carregarMedicamentos() {
            const resposta = await window.api.medicamentos.buscar();

            if (!resposta.sucesso) {
                setErro(
                    resposta.mensagem ??
                    "Não foi possível carregar os medicamentos."
                );

                return;
            }

            setMedicamentos(resposta.dados ?? []);
        }

        carregarMedicamentos();
    }, [open]);

    useEffect(() => {
        if (!open) return;

        setErro("");
        setItens([novoItem()]);
        setDataInicio(dataHoje());
        setDataFim("");
        setTipoRepeticao("DIARIA");
        setIntervaloDias(1);
        setTipoHorario("EXATO");
        setHorarios(["08:00"]);
        setNovoHorario("12:00");
        setHorarioInicio("08:00");
        setIntervaloHoras(8);
        setAtivo(true);
    }, [open, tipo]);

    function atualizarItem(
        id: string,
        campo: keyof ICriarTratamentoItem,
        valor: string | number
    ) {
        setItens((atual) =>
            atual.map((item) =>
                item.id === id
                    ? { ...item, [campo]: valor }
                    : item
            )
        );
    }

    function adicionarItem() {
        setItens((atual) => [...atual, novoItem()]);
    }

    function removerItem(id: string) {
        setItens((atual) =>
            atual.length === 1
                ? atual
                : atual.filter((item) => item.id !== id)
        );
    }

    function adicionarHorario() {
        if (!novoHorario || horarios.includes(novoHorario)) {
            return;
        }

        setHorarios((atual) =>
            [...atual, novoHorario].sort()
        );
    }

    function removerHorario(horario: string) {
        setHorarios((atual) =>
            atual.length === 1
                ? atual
                : atual.filter((item) => item !== horario)
        );
    }

    async function salvar(event: React.FormEvent) {
        event.preventDefault();
        setErro("");

        const itensFormatados = itens.map((item) => ({
            seqmedicamento: Number(item.seqmedicamento),
            quantidade: Number(item.quantidade),
            unidade: item.unidade.trim(),
            estoque: Number(item.estoque),
        }));

        const dadosBase = {
            ativo,
            data_inicio: dataInicio,
            data_fim: dataFim || null,
            itens: itensFormatados,
        };

        let dados: ITratamentoBody;

        if (tipoRepeticao === "DIARIA") {
            if (tipoHorario === "EXATO") {
                dados = {
                    ...dadosBase,
                    tipo_repeticao: "DIARIA",
                    tipo_horario: "EXATO",
                    horarios,
                };
            } else {
                dados = {
                    ...dadosBase,
                    tipo_repeticao: "DIARIA",
                    tipo_horario: "INTERVALO",
                    horario_inicio: horarioInicio,
                    intervalo_horas: Number(intervaloHoras),
                };
            }
        } else {
            if (tipoHorario === "EXATO") {
                dados = {
                    ...dadosBase,
                    tipo_repeticao: "A_CADA_DIAS",
                    intervalo_dias: Number(intervaloDias),
                    tipo_horario: "EXATO",
                    horarios,
                };
            } else {
                dados = {
                    ...dadosBase,
                    tipo_repeticao: "A_CADA_DIAS",
                    intervalo_dias: Number(intervaloDias),
                    tipo_horario: "INTERVALO",
                    horario_inicio: horarioInicio,
                    intervalo_horas: Number(intervaloHoras),
                };
            }
        }

        setCarregando(true);

        const resposta =
            await window.api.tratamentosPaciente.criar(
                seqpaciente,
                dados
            );

        setCarregando(false);

        if (!resposta.sucesso) {
            setErro(
                resposta.mensagem ??
                "Não foi possível criar o tratamento."
            );

            return;
        }

        onCreated();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl text-slate-800">
                        {tipo === "combo"
                            ? "Novo combo de medicamentos"
                            : "Novo tratamento"}
                    </DialogTitle>

                    <DialogDescription>
                        Configure os medicamentos, datas e horários do tratamento.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={salvar} className="space-y-2">
                    {erro && (
                        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {erro}
                        </p>
                    )}

                    <section className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-slate-800">
                                Medicamentos
                            </h3>

                            {tipo === "combo" && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={adicionarItem}
                                >
                                    <Plus />
                                    Adicionar item
                                </Button>
                            )}
                        </div>

                        {itens.map((item, indice) => (
                            <div
                                key={item.id}
                                className="grid min-w-0 gap-3 rounded-lg border bg-slate-50 p-3 md:grid-cols-[1fr_100px_120px_100px_auto]"
                            >

                                <div className="relative w-full">
                                    <select
                                        value={item.seqmedicamento}
                                        onChange={(event) =>
                                            atualizarItem(
                                                item.id,
                                                "seqmedicamento",
                                                Number(event.target.value)
                                            )
                                        }
                                        className="h-9 w-full appearance-none rounded-md border border-input px-3 text-sm"
                                        required
                                    >
                                        <option value={0}>
                                            Selecionar medicamento
                                        </option>

                                        {medicamentos.map((medicamento) => (
                                            <option
                                                key={medicamento.seqmedicamento}
                                                value={medicamento.seqmedicamento}
                                            >
                                                {medicamento.nome} — {medicamento.dosagem}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                    />
                                </div>

                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={item.quantidade}
                                    onChange={(event) =>
                                        atualizarItem(
                                            item.id,
                                            "quantidade",
                                            Number(event.target.value)
                                        )
                                    }
                                    placeholder="Qtd."
                                    required
                                />

                                <Input
                                    value={item.unidade}
                                    onChange={(event) =>
                                        atualizarItem(
                                            item.id,
                                            "unidade",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Unidade"
                                    required
                                />

                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={item.estoque}
                                    onChange={(event) =>
                                        atualizarItem(
                                            item.id,
                                            "estoque",
                                            Number(event.target.value)
                                        )
                                    }
                                    placeholder="Estoque"
                                    required
                                />

                                {tipo === "combo" && (
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        disabled={itens.length === 1}
                                        onClick={() =>
                                            removerItem(item.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                        aria-label={`Remover medicamento ${indice + 1}`}
                                    >
                                        <Minus />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Data de início
                            </label>

                            <Input
                                type="date"
                                value={dataInicio}
                                onChange={(event) =>
                                    setDataInicio(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Data de término
                            </label>

                            <Input
                                type="date"
                                value={dataFim}
                                min={dataInicio}
                                onChange={(event) =>
                                    setDataFim(event.target.value)
                                }
                            />

                            <p className="text-xs text-slate-500">
                                Deixe vazio para tratamento contínuo.
                            </p>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Repetição
                            </label>

                            <div className="relative w-full">
                                <select
                                    value={tipoRepeticao}
                                    onChange={(event) =>
                                        setTipoRepeticao(
                                            event.target.value as TipoRepeticao
                                        )
                                    }
                                    className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 text-sm"
                                >
                                    <option value="DIARIA">
                                        Diariamente
                                    </option>

                                    <option value="A_CADA_DIAS">
                                        A cada X dias
                                    </option>
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                />
                            </div>
                        </div>

                        {tipoRepeticao === "A_CADA_DIAS" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Intervalo em dias
                                </label>

                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={intervaloDias}
                                    onChange={(event) =>
                                        setIntervaloDias(
                                            Number(event.target.value)
                                        )
                                    }
                                    required
                                />
                            </div>
                        )}
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-slate-800">
                                Horários
                            </h3>

                            <div className="relative">
                                <select
                                    value={tipoHorario}
                                    onChange={(event) =>
                                        setTipoHorario(
                                            event.target.value as TipoHorario
                                        )
                                    }
                                    className="h-9 rounded-md appearance-none border border-input bg-transparent px-3 text-sm"
                                >
                                    <option value="EXATO">
                                        Horários exatos
                                    </option>

                                    <option value="INTERVALO">
                                        Intervalo em horas
                                    </option>
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                                />
                            </div>
                        </div>

                        {tipoHorario === "EXATO" ? (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="time"
                                        value={novoHorario}
                                        onChange={(event) =>
                                            setNovoHorario(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={adicionarHorario}
                                    >
                                        <Plus />
                                        Horário
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {horarios.map((horario) => (
                                        <span
                                            key={horario}
                                            className="flex items-center gap-1 rounded-md border bg-slate-50 px-2 py-1 text-sm"
                                        >
                                            {horario}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removerHorario(horario)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                                aria-label={`Remover horário ${horario}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Horário inicial
                                    </label>

                                    <Input
                                        type="time"
                                        value={horarioInicio}
                                        onChange={(event) =>
                                            setHorarioInicio(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Repetir a cada quantas horas?
                                    </label>

                                    <Input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={intervaloHoras}
                                        onChange={(event) =>
                                            setIntervaloHoras(
                                                Number(event.target.value)
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={ativo}
                            onChange={(event) =>
                                setAtivo(event.target.checked)
                            }
                        />
                        Tratamento ativo
                    </label>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={carregando}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Salvando..."
                                : "Criar tratamento"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}