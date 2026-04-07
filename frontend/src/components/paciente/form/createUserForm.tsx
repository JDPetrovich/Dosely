import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";

import { Eye, EyeOff } from "lucide-react";

import {
  pacienteSchema,
  type PacienteFormInput,
  type PacienteFormOutput,
} from "@/schema/paciente.schema";
import { formatarCPF, formatarTelefone } from "@/utils/formatar";

type Props = {
  paciente?: PacienteFormInput;
  onSave: (data: PacienteFormOutput) => Promise<void>;
  onSuccess?: () => void;
};

export function CreateUserForm({ paciente, onSuccess, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PacienteFormInput, any, PacienteFormOutput>({
    mode: "onChange",
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nomepaciente: "",
      dtnascimentopaciente: "",
      codpaciente: "",
      senhapaciente: "",
      cpfpaciente: "",
      telpaciente: "",
      emailpaciente: "",
    },
  });

  useEffect(() => {
    if (paciente) {
      reset({
        ...paciente,
        cpfpaciente: formatarCPF(paciente.cpfpaciente ?? ""),
        telpaciente: paciente.telpaciente ? formatarTelefone(paciente.telpaciente) : "",
      });
    }
  }, [paciente, reset]);

  async function handleFormSubmit(data: PacienteFormOutput) {
    try {
      setLoading(true);
      const payload = {
        ...data,
        cpfpaciente: data.cpfpaciente.replace(/\D/g, ""),
        telpaciente: data.telpaciente?.replace(/\D/g, ''),
      };

      await onSave(payload);

      onSuccess?.();
      if (!paciente) reset();
    } catch (error) {
      console.error("Erro no formulário:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="nomepaciente">Nome</Label>
              <span
                id="nomepaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.nomepaciente?.message ?? ""}
              </span>
            </div>

            <Input
              id="nomepaciente"
              {...register("nomepaciente")}
              placeholder="Informe o Nome"
              aria-invalid={!!errors.nomepaciente}
              aria-describedby="nomepaciente-error"
            />
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="dtnascimentopaciente">Data de nascimento</Label>
              <span
                id="dtnascimentopaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.dtnascimentopaciente?.message ?? ""}
              </span>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {watch("dtnascimentopaciente")
                    ? format(parseISO(watch("dtnascimentopaciente")), "dd/MM/yyyy")
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("dtnascimentopaciente") ? parseISO(watch("dtnascimentopaciente")) : undefined}
                  onSelect={(date) => {
                    if (date) setValue("dtnascimentopaciente", format(date, "yyyy-MM-dd"))
                  }}
                  defaultMonth={watch("dtnascimentopaciente") ? parseISO(watch("dtnascimentopaciente")) : undefined}
                  captionLayout="dropdown"
                  className="rounded-lg border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="codpaciente">Código</Label>
              <span
                id="codpaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.codpaciente?.message ?? ""}
              </span>
            </div>

            <Input
              id="codpaciente"
              {...register("codpaciente", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                }
              })}
              placeholder="Ex: ADM"
              aria-invalid={!!errors.codpaciente}
              aria-describedby="codpaciente-error"
            />
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="senhapaciente">Senha</Label>
              <span
                id="senhapaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.senhapaciente?.message ?? ""}
              </span>
            </div>

            <Input
              id="senhapaciente"
              type={showPassword ? "text" : "password"}
              placeholder="Informe uma Senha"
              className="pr-10"
              {...register("senhapaciente")}
              aria-invalid={!!errors.senhapaciente}
              aria-describedby="senhapaciente-error"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="cpfpaciente">CPF</Label>
              <span
                id="cpfpaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.cpfpaciente?.message ?? ""}
              </span>
            </div>

            <Input
              id="cpfpaciente"
              placeholder="000.000.000-00"
              {...register("cpfpaciente")}
              onChange={(e) =>
                setValue("cpfpaciente", formatarCPF(e.target.value))
              }
              aria-invalid={!!errors.cpfpaciente}
              aria-describedby="cpfpaciente-error"
            />
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="telpaciente">Telefone</Label>
              <span
                id="telpaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.telpaciente?.message ?? ""}
              </span>
            </div>

            <Input
              id="telpaciente"
              {...register("telpaciente")}
              onChange={(e) => {
                const nums = e.target.value.replace(/\D/g, "");
                setValue("telpaciente", formatarTelefone(nums.slice(0, 11)));
              }}
              placeholder="(00) 00000-0000"
              aria-invalid={!!errors.telpaciente}
              aria-describedby="telpaciente-error"
            />
          </div>

          <div className="grid gap-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailpaciente">Email</Label>
              <span
                id="emailpaciente-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.emailpaciente?.message ?? ""}
              </span>
            </div>

            <Input
              id="emailpaciente"
              placeholder="seu.email@exemplo.com"
              {...register("emailpaciente")}
              onChange={(e) =>
                setValue("emailpaciente", e.target.value)
              }
              aria-invalid={!!errors.cpfpaciente}
              aria-describedby="cpfpaciente-error"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
