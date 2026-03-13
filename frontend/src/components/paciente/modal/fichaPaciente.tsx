"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  User,
  Pill,
  AlertCircle,
  X,
  Edit,
  Phone,
  Mail,
  Clock,
  Calendar as CalendarIcon,
  Bell,
  Package,
  CalendarCheck,
  Clock3,
  Clock4,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { maskCPF } from "@/utils/maskCpf";
import { calcularIdade } from "@/utils/calcularIdade";
import { formatarDataNascimento } from "@/utils/FormatarIdade";
import { maskTelefone } from "@/utils/maskTel";

interface FichaPacienteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: any;
  onEdit?: () => void;
}

export function FichaPaciente({ open, onOpenChange, onEdit, paciente }: FichaPacienteProps) {
  const [isContinuous, setIsContinuous] = useState(false);
  const [isExactTime, setIsExactTime] = useState(true);
  const [medicamentos, setMedicamentos] = useState([
    { id: 1, nome: "Paracetamol", dosagem: "500mg", ativo: true },
    { id: 2, nome: "Losartana", dosagem: "50mg", ativo: true },
  ]);

  if (!open) return null;

  console.log("Dados do paciente na ficha:", paciente);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header do modal */}
        <div className="flex items-center justify-between bg-white rounded-t-2xl px-6 py-4 border-b shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Controle de Medicamentos</h1>
            <p className="text-gray-600 mt-1">Registro e monitoramento de medicamentos do paciente</p>
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

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna esquerda - Informações do paciente */}
            <div className="lg:col-span-1 space-y-6">
              {/* Informações básicas */}
              <Card className="shadow-sm">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="flex items-center justify-between text-blue-900">
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
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Nome:</span>
                      <span className="text-gray-900 font-medium">{paciente.nomeusuario}</span>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Data Nasc.</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formatarDataNascimento(paciente.dtnascimentousuario)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Idade</p>
                        <p className="text-gray-900 font-semibold">{calcularIdade(paciente.dtnascimentousuario)} anos</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-gray-500">CPF</p>
                      <p className="text-gray-900 font-mono mt-1">
                        {maskCPF(paciente.cpfusuario)}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-gray-500">Contato</p>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {paciente.telusuario ? maskTelefone(paciente.telusuario) : "Não informado"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {paciente.emailusuario || "Não informado"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alergias e restrições */}
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
                      className="h-8 px-2 text-red-700 hover:text-red-900 hover:bg-red-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="destructive" className="cursor-pointer">
                      Penicilina
                    </Badge>
                    <Badge variant="destructive" className="cursor-pointer">
                      Dipirona
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-dashed cursor-pointer hover:bg-red-50 text-red-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Status de notificações */}
              <Card className="shadow-sm border-green-100">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="flex items-center justify-between text-green-900">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Status Notificações
                    </div>
                    <Switch checked={true} />
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
            </div>

            {/* Coluna direita - Controle de medicamentos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Abas principais */}
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
                      {/* TAB: Medicamentos Ativos */}
                      <TabsContent value="ativos" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Medicamentos em Uso
                          </h3>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Remédio
                          </Button>
                        </div>

                        {/* Lista de medicamentos */}
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
                                        <h4 className="font-bold text-gray-900 text-lg">{med.nome}</h4>
                                        <p className="text-gray-600">Dosagem: {med.dosagem}</p>
                                      </div>
                                      <Badge variant={med.ativo ? "default" : "outline"}
                                        className={med.ativo ? "bg-green-100 text-green-800" : ""}>
                                        {med.ativo ? "Ativo" : "Inativo"}
                                      </Badge>
                                    </div>

                                    {/* Configuração de horários */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Tipo de horário */}
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">Tipo de Horário</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-sm ${isExactTime ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                              Hora Exata
                                            </span>
                                            <Switch
                                              checked={!isExactTime}
                                              onCheckedChange={(checked) => setIsExactTime(!checked)}
                                            />
                                            <span className={`text-sm ${!isExactTime ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                              De X em X horas
                                            </span>
                                          </div>
                                        </div>

                                        {isExactTime ? (
                                          <div className="space-y-2">
                                            <Label>Horários de tomada</Label>
                                            <div className="flex flex-wrap gap-2">
                                              <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                                                08:00
                                              </Badge>
                                              <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                                                14:00
                                              </Badge>
                                              <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
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

                                      {/* Período de tratamento */}
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">Período</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-sm ${!isContinuous ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                              Datas específicas
                                            </span>
                                            <Switch
                                              checked={isContinuous}
                                              onCheckedChange={setIsContinuous}
                                            />
                                            <span className={`text-sm ${isContinuous ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
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
                                              <Badge variant="outline" className="border-dashed">
                                                + Adicionar
                                              </Badge>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Quantidade e combo */}
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
                                          <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                                            Losartana
                                          </Badge>
                                          <Badge variant="outline" className="border-dashed">
                                            + Vincular
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="ml-2 text-gray-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Botões de ação */}
                        <div className="flex justify-between pt-4">
                          <Button variant="outline" className="border-gray-300">
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            Ver Calendário Completo
                          </Button>
                          <div className="flex gap-3">
                            <Button variant="outline" className="border-gray-300">
                              Exportar Relatório
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Salvar Todas Alterações
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      {/* TAB: Remédios Judiciais */}
                      <TabsContent value="judiciais">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Controle de Remédios Judiciais
                            </h3>
                            <Button variant="outline" className="border-amber-300 text-amber-700">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Novo Judicial
                            </Button>
                          </div>

                          <Card className="border-amber-200">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-amber-100 rounded-lg">
                                    <Package className="h-6 w-6 text-amber-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Metformina</h4>
                                    <p className="text-gray-600">Judicial - Fornecimento mensal</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                    <div>
                                      <Label>Última retirada</Label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-900">15/02/2024</span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Próxima retirada</Label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <CalendarIcon className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600 font-medium">15/03/2024</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label>Dias até próx. retirada</Label>
                                      <div className="mt-1">
                                        <Badge variant="default" className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                                          12 dias
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Status Alerta</Label>
                                      <div className="mt-1">
                                        <Badge variant="outline" className="border-green-200 text-green-700">
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
                                      <Switch checked={true} />
                                      <span className="text-sm text-gray-700">Notificar 5 dias antes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Switch checked={true} />
                                      <span className="text-sm text-gray-700">Notificar diariamente após vencimento</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* TAB: Histórico */}
                      <TabsContent value="historico">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Histórico de Tomadas
                            </h3>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Hoje
                              </Button>
                              <Button variant="outline" size="sm">
                                Esta semana
                              </Button>
                              <Button variant="outline" size="sm">
                                Este mês
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((item) => (
                              <div key={item} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${item % 2 === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                      {item % 2 === 0 ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                      ) : (
                                        <Clock4 className="h-5 w-5 text-red-600" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">Paracetamol 500mg</p>
                                      <p className="text-sm text-gray-600">Horário programado: 08:00</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">07/03/2024</p>
                                    <p className={`text-sm ${item % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {item % 2 === 0 ? 'Tomado às 08:05' : 'Pendente'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardHeader>
              </Card>

              {/* Resumo diário */}
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
                      <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
                    </div>
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">Tomados</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">2</p>
                    </div>
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">Pendentes</p>
                      <p className="text-2xl font-bold text-amber-600 mt-1">2</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Bell className="h-4 w-4 mr-2" />
                      Enviar Lembrete para Todos os Pendentes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}