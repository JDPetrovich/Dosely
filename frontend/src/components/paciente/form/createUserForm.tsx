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
  onSave: (data: PacienteFormOutput) => Promise<boolean>;
  onSuccess?: () => void;
};

export function CreateUserForm({ paciente, onSuccess, onSave }: Props) {
  const isEditing = !!paciente;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<PacienteFormInput, any, PacienteFormOutput>({
    mode: "onChange",
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nome: "",
      data_nascimento: "",
      login: "",
      senha: "",
      cpf: "",
      telefone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (paciente) {
      reset({
        ...paciente,
        cpf: formatarCPF(paciente.cpf ?? ""),
        telefone: paciente.telefone ? formatarTelefone(paciente.telefone) : "",
      });
    }
  }, [paciente, reset]);

  async function handleFormSubmit(data: PacienteFormOutput) {
    if (!isEditing && (!data.senha || data.senha.length < 8)) {
      setError("senha", {
        type: "manual",
        message: !data.senha ? "*Senha é obrigatória" : "*Senha mínimo 8 caracteres",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
        telefone: data.telefone?.replace(/\D/g, ''),
      };

      if (isEditing && !data.senha) {
        delete payload.senha;
      }

      const sucesso = await onSave(payload);

      if (!sucesso) {
        return;
      }

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
              <Label htmlFor="nome">Nome</Label>
              <span
                id="nome-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.nome?.message ?? ""}
              </span>
            </div>

            <Input
              id="nome"
              {...register("nome")}
              placeholder="Informe o Nome"
              aria-invalid={!!errors.nome}
              aria-describedby="nome-error"
            />
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="data_nascimento">Data de nascimento</Label>
              <span
                id="data_nascimento-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.data_nascimento?.message ?? ""}
              </span>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {watch("data_nascimento")
                    ? format(parseISO(watch("data_nascimento")), "dd/MM/yyyy")
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("data_nascimento") ? parseISO(watch("data_nascimento")) : undefined}
                  onSelect={(date) => {
                    if (date) setValue("data_nascimento", format(date, "yyyy-MM-dd"))
                  }}
                  defaultMonth={watch("data_nascimento") ? parseISO(watch("data_nascimento")) : undefined}
                  captionLayout="dropdown"
                  className="rounded-lg border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="login">Código</Label>
              <span
                id="login-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.login?.message ?? ""}
              </span>
            </div>

            <Input
              id="login"
              {...register("login", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                }
              })}
              placeholder="Ex: ADM"
              aria-invalid={!!errors.login}
              aria-describedby="login-error"
            />
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha">Senha</Label>
              <span
                id="senha-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.senha?.message ?? ""}
              </span>
            </div>

            <Input
              id="senha"
              type={showPassword ? "text" : "password"}
              placeholder={isEditing ? "••••••••" : "Informe uma Senha"}
              className="pr-10"
              {...register("senha")}
              aria-invalid={!!errors.senha}
              aria-describedby="senha-error"
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
              <Label htmlFor="cpf">CPF</Label>
              <span
                id="cpf-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.cpf?.message ?? ""}
              </span>
            </div>

            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...register("cpf")}
              onChange={(e) =>
                setValue("cpf", formatarCPF(e.target.value))
              }
              aria-invalid={!!errors.cpf}
              aria-describedby="cpf-error"
            />
          </div>

          <div className="grid gap-1 relative">
            <div className="flex items-center justify-between">
              <Label htmlFor="telefone">Telefone</Label>
              <span
                id="telefone-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.telefone?.message ?? ""}
              </span>
            </div>

            <Input
              id="telefone"
              {...register("telefone")}
              onChange={(e) => {
                const nums = e.target.value.replace(/\D/g, "");
                setValue("telefone", formatarTelefone(nums.slice(0, 11)));
              }}
              placeholder="(00) 00000-0000"
              aria-invalid={!!errors.telefone}
              aria-describedby="telefone-error"
            />
          </div>

          <div className="grid gap-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              <span
                id="email-error"
                className="text-xs text-red-600 min-h-4"
              >
                {errors.email?.message ?? ""}
              </span>
            </div>

            <Input
              id="email"
              placeholder="seu.email@exemplo.com"
              {...register("email")}
              onChange={(e) =>
                setValue("email", e.target.value)
              }
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
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
