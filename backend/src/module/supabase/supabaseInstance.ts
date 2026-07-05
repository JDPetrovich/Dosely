import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_KEY!;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error(
                "❌ Erro: Variáveis de ambiente Supabase não configuradas"
            );
        }

        supabase = createClient(supabaseUrl, supabaseKey);
    }
    return supabase;
}