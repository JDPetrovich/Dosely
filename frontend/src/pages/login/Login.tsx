import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const res = await window.api.usuario.login({ login, senha });
            if (!res.sucesso) {
                setErro(res.mensagem || "Erro no login");
                return;
            }
            navigate("/principal");

        } catch (err) {
            setErro("Usuário ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow w-full max-w-sm"
            >
                <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

                {erro && (
                    <p className="text-red-500 text-sm mb-3">{erro}</p>
                )}

                <div className="mb-3">
                    <label className="block text-sm mb-1">Login</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value = e.target.value.toUpperCase())}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        required

                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}