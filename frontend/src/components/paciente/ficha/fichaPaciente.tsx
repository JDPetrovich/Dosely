"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock3,
  Package,
  CalendarCheck,
  X,
} from "lucide-react";

import { DadosPaciente } from "./dadosPaciente";
import { AlergiasRestricoes } from "./alergiasRestricoes";
import { StatusNotificacoes } from "./statusNotificacoes";
import { ResumoDia } from "./resumoDia";
import { Histórico } from "./historico";
import { MedicamentosAtivos } from "./medicamentosAtivos";
import { RemediosJudiciais } from "./remediosJudiciais";

interface FichaPacienteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: any;
  onEdit?: () => void;
}

export function FichaPaciente({
  open,
  onOpenChange,
  onEdit,
  paciente,
}: FichaPacienteProps) {
  //const [isContinuous, setIsContinuous] = useState(false);
  //const [isExactTime, setIsExactTime] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full h-full max-h-[90vh] overflow-hidden flex flex-col rounded-2xl mx-4">

        <CardHeader className="flex flex-row items-center justify-between border-b shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Controle de Medicamentos
            </h1>
            <p className="text-gray-600 mt-1">
              Registro e monitoramento de medicamentos do paciente
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 p-4 md:p-6 overflow-hidden">
          <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-5 gap-6">

            <div className="lg:col-span-1 min-h-0 overflow-y-auto scrollbar">
              <div className="space-y-6">
                <DadosPaciente paciente={paciente} onEdit={onEdit} />
                <AlergiasRestricoes />
                <StatusNotificacoes />
              </div>
            </div>

            <div className="lg:col-span-4 min-h-0 overflow-y-auto scrollbar">
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <Tabs defaultValue="ativos" className="w-full">
                    <CardHeader className="border-b">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="ativos" className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          <span>Medicamentos Ativos</span>
                        </TabsTrigger>
                        <TabsTrigger value="judiciais" className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>Remédios Judiciais</span>
                        </TabsTrigger>
                        <TabsTrigger value="historico" className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4" />
                          <span>Histórico</span>
                        </TabsTrigger>
                      </TabsList>
                    </CardHeader>

                    <CardContent className="">
                      <TabsContent value="ativos" className="space-y-6">
                        <MedicamentosAtivos />
                      </TabsContent>

                      <TabsContent value="judiciais">
                        <RemediosJudiciais />
                      </TabsContent>

                      <TabsContent value="historico">
                        <Histórico />
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>

                <ResumoDia />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}