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

import { maskCPF } from "@/utils/maskCpf";
import {
  usuarioSchema,
  type UsuarioFormInput,
  type UsuarioFormOutput,
} from "@/schema/usuario.schema";
import { maskTelefone } from "@/utils/maskTel";

type Props = {
  paciente?: UsuarioFormInput;
  onSave: (data: UsuarioFormOutput) => Promise<void>;
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
  } = useForm<UsuarioFormInput, any, UsuarioFormOutput>({
    mode: "onChange",
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nomeusuario: "",
      dtnascimentousuario: "",
      codusuario: "",
      senhausuario: "",
      cpfusuario: "",
      telusuario: "",
      emailusuario: "",
    },
  });

  useEffect(() => {
    if (paciente) {
      reset({
        ...paciente,
        cpfusuario: maskCPF(paciente.cpfusuario ?? ""),
        telusuario: paciente.telusuario ? maskTelefone(paciente.telusuario) : "",
      });
    }
  }, [paciente, reset]);

  async function handleFormSubmit(data: UsuarioFormOutput) {
    try {
      setLoading(true);
      const payload = {
        ...data,
        cpfusuario: data.cpfusuario.replace(/\D/g, ""),
        telusuario: data.telusuario?.replace(/\D/g, ''),
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
              <Label htmlFor="nomeusuario">Nome</Label>
              <span
                id="nomeusuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.nomeusuario?.message ?? ""}
              </span>
            </div>

            <Input
              id="nomeusuario"
              {...register("nomeusuario")}
              placeholder="Informe o Nome"
              aria-invalid={!!errors.nomeusuario}
              aria-describedby="nomeusuario-error"
            />
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="dtnascimentousuario">Data de nascimento</Label>
              <span
                id="dtnascimentousuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.dtnascimentousuario?.message ?? ""}
              </span>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {watch("dtnascimentousuario")
                    ? format(parseISO(watch("dtnascimentousuario")), "dd/MM/yyyy")
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("dtnascimentousuario") ? parseISO(watch("dtnascimentousuario")) : undefined}
                  onSelect={(date) => {
                    if (date) setValue("dtnascimentousuario", format(date, "yyyy-MM-dd"))
                  }}
                  defaultMonth={watch("dtnascimentousuario") ? parseISO(watch("dtnascimentousuario")) : undefined}
                  captionLayout="dropdown"
                  className="rounded-lg border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="codusuario">Código</Label>
              <span
                id="codusuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.codusuario?.message ?? ""}
              </span>
            </div>

            <Input
              id="codusuario"
              {...register("codusuario", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                }
              })}
              placeholder="Ex: ADM"
              aria-invalid={!!errors.codusuario}
              aria-describedby="codusuario-error"
            />
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="senhausuario">Senha</Label>
              <span
                id="senhausuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.senhausuario?.message ?? ""}
              </span>
            </div>

            <Input
              id="senhausuario"
              type={showPassword ? "text" : "password"}
              placeholder="Informe uma Senha"
              className="pr-10"
              {...register("senhausuario")}
              aria-invalid={!!errors.senhausuario}
              aria-describedby="senhausuario-error"
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
              <Label htmlFor="cpfusuario">CPF</Label>
              <span
                id="cpfusuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.cpfusuario?.message ?? ""}
              </span>
            </div>

            <Input
              id="cpfusuario"
              placeholder="000.000.000-00"
              {...register("cpfusuario")}
              onChange={(e) =>
                setValue("cpfusuario", maskCPF(e.target.value))
              }
              aria-invalid={!!errors.cpfusuario}
              aria-describedby="cpfusuario-error"
            />
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="telusuario">Telefone</Label>
              <span
                id="telusuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.telusuario?.message ?? ""}
              </span>
            </div>

            <Input
              id="telusuario"
              {...register("telusuario")}
              onChange={(e) => {
                const nums = e.target.value.replace(/\D/g, "");
                setValue("telusuario", maskTelefone(nums.slice(0, 11)));
              }}
              placeholder="(00) 00000-0000"
              aria-invalid={!!errors.telusuario}
              aria-describedby="telusuario-error"
            />
          </div>

          <div className="grid gap-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailusuario">Email</Label>
              <span
                id="emailusuario-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.emailusuario?.message ?? ""}
              </span>
            </div>

            <Input
              id="emailusuario"
              placeholder="seu.email@exemplo.com"
              {...register("emailusuario")}
              onChange={(e) =>
                setValue("emailusuario", e.target.value)
              }
              aria-invalid={!!errors.cpfusuario}
              aria-describedby="cpfusuario-error"
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
