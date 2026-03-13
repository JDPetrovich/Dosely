import { maskCPF } from "@/utils/maskCpf";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { calcularIdade } from "@/utils/calcularIdade";

type Props = {
  nome: string;
  dtnascimentousuario: string;
  cpf: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function PacienteCard({ nome, dtnascimentousuario, cpf, onClick, onEdit, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        w-full h-36
        rounded-2xl
        border border-slate-200
        p-4
        flex flex-col justify-between
        cursor-pointer
        bg-white
        hover:border-teal-400
        hover:shadow-md
        active:scale-[0.98]
        transition
        relative
      "
    >
      {/* MENU DE AÇÕES (TRÊS PONTINHOS) */}
      <div className="absolute top-2 right-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full hover:bg-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="pr-8">
        <p className="font-semibold text-slate-800 truncate">{nome}</p>
        <p className="text-sm text-slate-500">Idade: {calcularIdade(dtnascimentousuario)} anos</p>
      </div>

      <p className="text-xs text-gray-400 truncate">{maskCPF(cpf)}</p>
    </div>
  );
}