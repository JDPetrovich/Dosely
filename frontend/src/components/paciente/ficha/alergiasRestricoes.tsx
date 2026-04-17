import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Settings } from "lucide-react";
import type { AlergiaFormOutput } from "@/schema/paciente.schema";
import { useEffect, useState } from "react";
import { usePaciente } from "@/contexts/paciente.context";

export function AlergiasRestricoes({ onEdit }: { onEdit: () => void }) {
    const [alergiaspaciente, setAlergiaspaciente] = useState<AlergiaFormOutput[]>([]);
    const { paciente } = usePaciente();

    const carregarAlergiaspaciente = async (seqpaciente: number) => {
        const respostaIpc = await window.api.alergiasPaciente.buscar(seqpaciente);
        if (respostaIpc.sucesso) {
            setAlergiaspaciente(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    };

    useEffect(() => {
        if (paciente?.seqpaciente) {
            carregarAlergiaspaciente(paciente.seqpaciente);
        }
    }, [paciente?.seqpaciente]);

    return (
        <Card className="shadow-sm border-red-100">
            <CardHeader className="bg-red-50 border-b">
                <CardTitle className="flex items-center justify-between text-red-900">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Alergias & Restrições
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="h-8 px-2 text-red-700 hover:text-red-900 hover:bg-red-100"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-2">
                {alergiaspaciente.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {alergiaspaciente.map((a) => (
                            <Badge
                                key={a.seqalergia}
                                variant="destructive"
                                className="cursor-default"
                            >
                                {a.descalergia}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <div
                        onClick={onEdit}
                        className="text-sm text-red-700 cursor-pointer hover:underline"
                    >
                        Nenhuma alergia cadastrada. Clique para gerenciar.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}