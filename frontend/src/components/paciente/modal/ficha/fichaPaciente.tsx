"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock3,
  Package,
  CalendarCheck,
  X,
} from "lucide-react";
import { useState } from "react";

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
  const [isContinuous, setIsContinuous] = useState(false);
  const [isExactTime, setIsExactTime] = useState(true);
  const [medicamentos, setMedicamentos] = useState([
    { id: 1, nome: "Paracetamol", dosagem: "500mg", ativo: true },
    { id: 2, nome: "Losartana", dosagem: "50mg", ativo: true },
  ]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

        <div className="flex items-center justify-between bg-white rounded-t-2xl px-6 py-4 border-b shadow-sm">
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
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <DadosPaciente paciente={paciente} onEdit={onEdit} />
              <AlergiasRestricoes />
              <StatusNotificacoes />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="border-b">
                  <Tabs defaultValue="ativos" className="w-full">
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

                    <div className="mt-6">
                      <TabsContent value="ativos" className="space-y-6">
                        <div className="text-center py-8 text-gray-500">
                          <MedicamentosAtivos medicamentos={medicamentos} />
                        </div>
                      </TabsContent>

                      <TabsContent value="judiciais">
                        <div className="text-center py-8 text-gray-500">
                          <RemediosJudiciais />
                        </div>
                      </TabsContent>

                      <TabsContent value="historico">
                        <Histórico />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardHeader>
              </Card>

              <ResumoDia />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}