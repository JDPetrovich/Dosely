import { Header } from "@/components/header/header";
import type { TarefaFormOutput } from "@/schema/paciente.schema";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Remedio() {
    const [tarefas, setTarefas] = useState<TarefaFormOutput[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [descricao, setDescricao] = useState("");
    const [tarefaEditando, setTarefaEditando] = useState<TarefaFormOutput | null>(null);

    const carregarTarefas = async () => {
        const respostaIpc = await window.api.tarefas.buscar();

        if (respostaIpc.sucesso) {
            setTarefas(respostaIpc.dados);
        } else {
            console.error("Erro IPC:", respostaIpc.mensagem);
        }
    };

    useEffect(() => {
        carregarTarefas();
    }, []);

    const abrirCadastro = () => {
        setTarefaEditando(null);
        setDescricao("");
        setModalAberto(true);
    };

    const abrirEdicao = (tarefa: TarefaFormOutput) => {
        setTarefaEditando(tarefa);
        setDescricao(tarefa.descricao);
        setModalAberto(true);
    };

    const salvar = async () => {
        if (!descricao.trim()) return;

        try {
            if (tarefaEditando) {
                await window.api.tarefas.atualizar(
                    tarefaEditando.seqtarefa,
                    descricao,
                );
            } else {
                await window.api.tarefas.criar(descricao);
            }

            setModalAberto(false);
            setDescricao("");
            setTarefaEditando(null);

            carregarTarefas();
        } catch (erro) {
            console.error(erro);
        }
    };

    const alterarStatus = async (tarefa: TarefaFormOutput) => {
        try {
            await window.api.tarefas.alterarStatus(
                tarefa.seqtarefa,
                !tarefa.concluido,
            );

            carregarTarefas();
        } catch (erro) {
            console.error(erro);
        }
    };

    return (
        <div className="h-screen flex flex-col text-gray-800 overflow-hidden">
            <Header />

            <main className="flex-1 flex flex-col items-center gap-6 overflow-hidden">
                <div className="w-full max-w-2xl flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tarefas</h1>

                    <button
                        onClick={abrirCadastro}
                        className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={18} />
                        Nova tarefa
                    </button>
                </div>

                <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 mb-2 flex flex-col h-[80vh]">
                    {tarefas.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            Nenhuma tarefa cadastrada.
                        </p>
                    ) : (
                        <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
                            {tarefas.map((tarefa) => (
                                <li
                                    key={tarefa.seqtarefa}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition
                                    ${tarefa.concluido
                                            ? "bg-green-50 border-green-200"
                                            : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={!!tarefa.concluido}
                                            onChange={() => alterarStatus(tarefa)}
                                            className="w-5 h-5 accent-teal-500 cursor-pointer"
                                        />

                                        <span
                                            className={`font-medium ${tarefa.concluido
                                                ? "line-through text-gray-400"
                                                : "text-gray-800"
                                                }`}
                                        >
                                            {tarefa.descricao}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => abrirEdicao(tarefa)}
                                        className="cursor-pointer text-gray-500 hover:text-teal-600 transition"
                                        title="Editar tarefa"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            {modalAberto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {tarefaEditando ? "Editar tarefa" : "Nova tarefa"}
                        </h2>

                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descrição da tarefa"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                            autoFocus
                        />

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => {
                                    setModalAberto(false);
                                    setDescricao("");
                                    setTarefaEditando(null);
                                }}
                                className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={salvar}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}