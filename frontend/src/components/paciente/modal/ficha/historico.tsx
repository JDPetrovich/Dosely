import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock4 } from "lucide-react";

interface HistóricoItem {
  id: number;
  medicamento: string;
  dosagem: string;
  horarioProgramado: string;
  data: string;
  tomado: boolean;
  horarioReal?: string;
}

interface HistóricoProps {
  itens?: HistóricoItem[];
  onFiltrar?: (filtro: "hoje" | "semana" | "mes") => void;
}

export function Histórico({ itens = [], onFiltrar }: HistóricoProps) {
  const defaultItens = [
    {
      id: 1,
      medicamento: "Paracetamol 500mg",
      horarioProgramado: "08:00",
      data: "07/03/2024",
      tomado: false,
      status: "Pendente",
    },
    {
      id: 2,
      medicamento: "Paracetamol 500mg",
      horarioProgramado: "08:00",
      data: "07/03/2024",
      tomado: true,
      horarioReal: "08:05",
      status: "Tomado às 08:05",
    },
  ];

  const items = itens.length > 0 ? itens : defaultItens;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Tomadas
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onFiltrar?.("hoje")}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={() => onFiltrar?.("semana")}>
            Esta semana
          </Button>
          <Button variant="outline" size="sm" onClick={() => onFiltrar?.("mes")}>
            Este mês
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    item.tomado ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {item.tomado ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock4 className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.medicamento}</p>
                  <p className="text-sm text-gray-600">
                    Horário programado: {item.horarioProgramado}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{item.data}</p>
                <p
                  className={`text-sm ${
                    item.tomado ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}