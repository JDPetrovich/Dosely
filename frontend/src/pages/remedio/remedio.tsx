import { Header } from "@/components/header/header"
import type { MedicamentoFormOutput } from "@/schema/paciente.schema";
import { useEffect, useState } from "react";

export default function Remedio() {
    const [medicamentos, setMedicamentos] = useState<MedicamentoFormOutput[]>([]);

    const carregarMedicamentos = async () => {
        const respostaIpc = await window.api.medicamentos.buscar();

        if (respostaIpc.sucesso) {
            setMedicamentos(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    }

    useEffect(() => {
        carregarMedicamentos();
    }, []);

    return (
        <div className="h-screen flex flex-col text-gray-800 overflow-hidden">
            <Header />
            <main className="flex-1 flex flex-col items-center gap-6 mt-16 p-6 overflow-hidden">
                <h1 className="text-2xl font-bold">Medicamentos</h1>
                <div className="w-full max-w-2xl bg-white rounded shadow p-4">
                    {medicamentos.length === 0 ? (
                        <p className="text-gray-500">Nenhum medicamento cadastrado.</p>
                    ) : (
                        <ul className="space-y-2">
                            {medicamentos.map((medicamento) => (
                                <li key={medicamento.seqmedicamento} className="border-b border-gray-200 pb-2">
                                    <p className="font-medium">{medicamento.nomemedicamento}</p>
                                    <p className="text-sm text-gray-600">{medicamento.descmedicamento}</p>
                                    <p className="text-sm text-gray-600">Dosagem: {medicamento.dosagem}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </main>
        </div>
    )
}