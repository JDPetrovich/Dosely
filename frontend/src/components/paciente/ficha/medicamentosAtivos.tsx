import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";

interface Medicamento {
    id: number;
    nome: string;
    dosagem: string;
    ativo: boolean;
}

interface MedicamentosAtivosProps {
    medicamentos?: Medicamento[];
    onAdicionarRemedio?: () => void;
    onRemoverMedicamento?: (id: number) => void;
    onSalvarAlteracoes?: () => void;
    onVerCalendario?: () => void;
    onExportarRelatorio?: () => void;
}

export function MedicamentosAtivos({
    medicamentos = [
        { id: 1, nome: "Paracetamol", dosagem: "500mg", ativo: true },
        { id: 2, nome: "Losartana", dosagem: "50mg", ativo: true },
    ],
    onAdicionarRemedio,
    onRemoverMedicamento,
    onSalvarAlteracoes,
    onVerCalendario,
    onExportarRelatorio,
}: MedicamentosAtivosProps) {
    const [isExactTime, setIsExactTime] = useState(true);
    const [isContinuous, setIsContinuous] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Medicamentos em Uso
                </h3>
                <Button
                    onClick={onAdicionarRemedio}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Remédio
                </Button>
            </div>

            <div className="space-y-4">
                {medicamentos.map((med) => (
                    <Card key={med.id} className="border hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Pill className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {med.nome}
                                            </h4>
                                            <p className="text-gray-600">Dosagem: {med.dosagem}</p>
                                        </div>
                                        <Badge
                                            variant={med.ativo ? "default" : "outline"}
                                            className={med.ativo ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {med.ativo ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </div>


                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">Tipo de Horário</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm ${isExactTime
                                                            ? "text-blue-600 font-medium"
                                                            : "text-gray-500"
                                                            }`}
                                                    >
                                                        Hora Exata
                                                    </span>
                                                    <Switch
                                                        checked={!isExactTime}
                                                        onCheckedChange={(checked) =>
                                                            setIsExactTime(!checked)
                                                        }
                                                    />
                                                    <span
                                                        className={`text-sm ${!isExactTime
                                                            ? "text-blue-600 font-medium"
                                                            : "text-gray-500"
                                                            }`}
                                                    >
                                                        De X em X horas
                                                    </span>
                                                </div>
                                            </div>

                                            {isExactTime ? (
                                                <div className="space-y-2">
                                                    <Label>Horários de tomada</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="cursor-pointer hover:bg-blue-50"
                                                        >
                                                            08:00
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="cursor-pointer hover:bg-blue-50"
                                                        >
                                                            14:00
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="cursor-pointer hover:bg-blue-50"
                                                        >
                                                            20:00
                                                        </Badge>
                                                        <Badge variant="outline" className="border-dashed">
                                                            + Adicionar
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label>Intervalo</Label>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="24"
                                                                    defaultValue="8"
                                                                    className="w-16 px-2 py-1 border rounded text-center"
                                                                />
                                                                <span className="text-gray-600">horas</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Hora Inicial</Label>
                                                            <input
                                                                type="time"
                                                                defaultValue="06:00"
                                                                className="w-full px-2 py-1 border rounded mt-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                                    <span className="font-medium">Período</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm ${!isContinuous
                                                            ? "text-blue-600 font-medium"
                                                            : "text-gray-500"
                                                            }`}
                                                    >
                                                        Datas específicas
                                                    </span>
                                                    <Switch
                                                        checked={isContinuous}
                                                        onCheckedChange={setIsContinuous}
                                                    />
                                                    <span
                                                        className={`text-sm ${isContinuous
                                                            ? "text-blue-600 font-medium"
                                                            : "text-gray-500"
                                                            }`}
                                                    >
                                                        Contínuo
                                                    </span>
                                                </div>
                                            </div>

                                            {isContinuous ? (
                                                <div className="space-y-2">
                                                    <Label>Duração do tratamento</Label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            defaultValue="30"
                                                            className="w-20 px-2 py-1 border rounded text-center"
                                                        />
                                                        <span className="text-gray-600">dias</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label>Selecionar datas</Label>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarRange className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600 text-sm">
                                                            Selecione as datas no calendário
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Badge variant="secondary">07/03</Badge>
                                                        <Badge variant="secondary">10/03</Badge>
                                                        <Badge variant="secondary">15/03</Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-dashed"
                                                        >
                                                            + Adicionar
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    <div className="mt-6 grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gray-500" />
                                                <Label>Quantidade em estoque</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    defaultValue="20"
                                                    className="w-20 px-2 py-1 border rounded text-center"
                                                />
                                                <span className="text-gray-600">unidades</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Combo com outros remédios</Label>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-blue-50"
                                                >
                                                    Losartana
                                                </Badge>
                                                <Badge variant="outline" className="border-dashed">
                                                    + Vincular
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

            <div className="flex justify-between pt-4">
                <Button
                    onClick={onVerCalendario}
                    variant="outline"
                    className="border-gray-300"
                >
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Ver Calendário Completo
                </Button>
                <div className="flex gap-3">
                    <Button
                        onClick={onExportarRelatorio}
                        variant="outline"
                        className="border-gray-300"
                    >
                        Exportar Relatório
                    </Button>
                    <Button
                        onClick={onSalvarAlteracoes}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Salvar Todas Alterações
                    </Button>
                </div>
            </div>
        </div>
    );
}