import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, CheckCircle2 } from "lucide-react";

interface StatusNotificaçõesProps {
    notificaçõesAtivas?: boolean;
    alertasCelular?: boolean;
    onToggle?: (ativo: boolean) => void;
}

export function StatusNotificacoes({
    notificaçõesAtivas = true,
    alertasCelular = true,
    onToggle,
}: StatusNotificaçõesProps) {
    return (
        <Card className="shadow-sm border-green-100">
            <CardHeader className="bg-green-50 border-b">
                <CardTitle className="flex items-center justify-between text-green-900">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Status Notificações
                    </div>
                    <Switch checked={notificaçõesAtivas} onCheckedChange={onToggle} />
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Notificações ativas</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Ativo
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Alertas no celular</span>
                        <Badge variant="outline" className="border-green-200">
                            Ligado
                        </Badge>
                    </div>
                    <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full border-green-200 text-green-700">
                            <Bell className="h-4 w-4 mr-2" />
                            Gerenciar Notificações
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}