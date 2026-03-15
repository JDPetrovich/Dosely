import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Package,
    AlertTriangle,
    Calendar as CalendarIcon,
    Bell,
} from "lucide-react";

interface RemédioJudicial {
    id: number;
    nome: string;
    tipo: string;
    ultimaRetirada: string;
    próximaRetirada: string;
    diasAtéProxima: number;
    alertaAtivo: boolean;
    notificar5DiasAntes: boolean;
    notificarDiariamenteAposVencimento: boolean;
}

interface RemédiosJudiciaisProps {
    remédios?: RemédioJudicial[];
    onAdicionarJudicial?: () => void;
    onToggleAlerta?: (id: number, ativo: boolean) => void;
    onToggleNotificacao?: (id: number, tipo: "antes" | "depois", ativo: boolean) => void;
}

export function RemediosJudiciais({
    remédios = [
        {
            id: 1,
            nome: "Metformina",
            tipo: "Judicial - Fornecimento mensal",
            ultimaRetirada: "15/02/2024",
            próximaRetirada: "15/03/2024",
            diasAtéProxima: 12,
            alertaAtivo: true,
            notificar5DiasAntes: true,
            notificarDiariamenteAposVencimento: true,
        },
    ],
    onAdicionarJudicial,
    onToggleAlerta,
    onToggleNotificacao,
}: RemédiosJudiciaisProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Controle de Remédios Judiciais
                </h3>
                <Button
                    onClick={onAdicionarJudicial}
                    variant="outline"
                    className="border-amber-300 text-amber-700"
                >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Novo Judicial
                </Button>
            </div>

            {remédios.map((remedio) => (
                <Card key={remedio.id} className="border-amber-200">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Package className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">
                                        {remedio.nome}
                                    </h4>
                                    <p className="text-gray-600">{remedio.tipo}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <Label>Última retirada</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-900">
                                                {remedio.ultimaRetirada}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Próxima retirada</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CalendarIcon className="h-4 w-4 text-green-500" />
                                            <span className="text-green-600 font-medium">
                                                {remedio.próximaRetirada}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <Label>Dias até próx. retirada</Label>
                                        <div className="mt-1">
                                            <Badge variant="default" className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                                                {remedio.diasAtéProxima} dias
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Status Alerta</Label>
                                        <div className="mt-1">
                                            <Badge
                                                variant="outline"
                                                className="border-green-200 text-green-700"
                                            >
                                                <Bell className="h-3 w-3 mr-1" />
                                                Ativo (inicia em 5 dias)
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Label>Configurar alertas</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={remedio.notificar5DiasAntes}
                                            onCheckedChange={(checked) =>
                                                onToggleNotificacao?.(remedio.id, "antes", checked)
                                            }
                                        />
                                        <span className="text-sm text-gray-700">
                                            Notificar 5 dias antes
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={remedio.notificarDiariamenteAposVencimento}
                                            onCheckedChange={(checked) =>
                                                onToggleNotificacao?.(remedio.id, "depois", checked)
                                            }
                                        />
                                        <span className="text-sm text-gray-700">
                                            Notificar diariamente após vencimento
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}