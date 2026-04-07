import { Header } from "@/components/header/header"
import type { AlergiaFormInput, AlergiaFormOutput } from "@/schema/paciente.schema";
import { useEffect, useState } from "react";

export default function Alergia() {
    const [alergias, setAlergias] = useState<AlergiaFormInput[]>([]);
    const [alergiaspaciente, setAlergiaspaciente] = useState<AlergiaFormOutput[]>([]);

    const carregarAlergias = async () => {
        const respostaIpc = await window.api.alergias.buscar();

        if (respostaIpc.sucesso) {
            setAlergias(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }

    const carregarAlergiaspaciente = async (seqpaciente: number) => {
        const respostaIpc = await window.api.alergiasPaciente.buscar(seqpaciente);
        if (respostaIpc.sucesso) {
            setAlergiaspaciente(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }

    useEffect(() => {
        carregarAlergias();
        carregarAlergiaspaciente(1);
    }, []);

    return (
        <div className="h-screen flex flex-col text-gray-800 overflow-hidden">
            <Header />
            <main className="flex-1 flex flex-col items-center gap-6 mt-16 p-6 overflow-hidden">
                <h1 className="text-2xl font-bold">Alergias</h1>
                <div className="w-full max-w-2xl bg-white rounded shadow p-4">

                    {alergias.length === 0 ? (
                        <p className="text-gray-500">Nenhuma alergia cadastrada.</p>
                    ) : (
                        <ul className="space-y-2">
                            {alergias.map((alergia) => (
                                <li key={alergia.seqalergia} className="border-b border-gray-200 pb-2">
                                    <p className="font-medium">{alergia.descalergia}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <h2 className="text-xl font-semibold mt-8">Alergias do Usuário</h2>
                <div className="w-full max-w-2xl bg-white rounded shadow p-4">
                    {alergiaspaciente.length === 0 ? (
                        <p className="text-gray-500">Nenhuma alergia associada a este usuário.</p>

                    ) : (
                        <ul className="space-y-2">
                            {alergiaspaciente.map((alergia) => (
                                <li key={alergia.seqalergia} className="border-b border-gray-200 pb-2">
                                    <p className="text-sm text-gray-500">seqpaciente: {alergia.seqpaciente}</p>
                                    <p className="text-sm text-gray-500">seqalergia: {alergia.seqalergia}</p>
                                    <p className="font-medium">{alergia.descalergia}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </main>
        </div>
    )
}