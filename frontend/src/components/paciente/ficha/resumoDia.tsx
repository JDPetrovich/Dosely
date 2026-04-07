import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Bell } from "lucide-react";

interface ResumoDiaProps {
  remediosHoje?: number;
  tomados?: number;
  pendentes?: number;
  onEnviarLembrete?: () => void;
}

export function ResumoDia({
  remediosHoje = 4,
  tomados = 2,
  pendentes = 2,
  onEnviarLembrete,
}: ResumoDiaProps) {
  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Resumo do Dia de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Remédios para hoje</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{remediosHoje}</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Tomados</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{tomados}</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendentes}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={onEnviarLembrete} className="w-full bg-blue-600 hover:bg-blue-700">
            <Bell className="h-4 w-4 mr-2" />
            Enviar Lembrete para Todos os Pendentes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}