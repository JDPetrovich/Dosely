import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { useState } from "react";


type Remedio = {
    id: string;
    nome: string;
    dosagem: string;
};

const remedios: Remedio[] = [
    { id: "1", nome: "Dipirona", dosagem: "500mg" },
    { id: "2", nome: "Paracetamol", dosagem: "750mg" },
];

export function SelectRemedio({
    value,
    onChange,
}: {
    value?: Remedio;
    onChange: (r: Remedio) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {value ? value.nome : "Selecionar remédio"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar remédio..." />
                    <CommandEmpty>Nenhum remédio encontrado</CommandEmpty>

                    <CommandGroup>
                        {remedios.map((r) => (
                            <CommandItem
                                key={r.id}
                                value={r.nome}
                                onSelect={() => {
                                    onChange(r);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value?.id === r.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <div className="flex flex-col">
                                    <span>{r.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {r.dosagem}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
