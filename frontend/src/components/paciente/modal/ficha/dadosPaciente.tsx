import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Phone,
  Mail,
  Edit,
} from "lucide-react";
import { maskCPF } from "@/utils/maskCpf";
import { calcularIdade } from "@/utils/calcularIdade";
import { formatarDataNascimento } from "@/utils/FormatarIdade";
import { maskTelefone } from "@/utils/maskTel";

interface DadosPacienteProps {
  paciente: any;
  onEdit?: () => void;
}

export function DadosPaciente({ paciente, onEdit }: DadosPacienteProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="flex items-center justify-between text-blue-900 mt-0.5">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Paciente
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="h-8 px-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Nome:</span>
            <span className="text-gray-900 font-medium">{paciente.nomepaciente}</span>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data Nasc.</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{formatarDataNascimento(paciente.dtnascimentopaciente)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Idade</p>
              <p className="text-gray-900 font-semibold">{calcularIdade(paciente.dtnascimentopaciente)} anos</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500">CPF</p>
            <p className="text-gray-900 font-mono mt-1">
              {maskCPF(paciente.cpfpaciente)}
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500">Contato</p>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 text-gray-900">
                <Phone className="h-4 w-4 text-gray-400" />
                {paciente.telpaciente ? maskTelefone(paciente.telpaciente) : "Não informado"}
              </div>
              <div className="flex items-center gap-2 text-gray-900">
                <Mail className="h-4 w-4 text-gray-400" />
                {paciente.emailpaciente || "Não informado"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}