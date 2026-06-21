import { supabase } from "../lib/supabase";
import type { Bot } from "../types/bot";

export async function getBot(id: string): Promise<Bot | null> {
  const { data } = await supabase
    .from("bots")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function listBots(): Promise<Bot[]> {
  const { data } = await supabase
    .from("bots")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function createBot(
  bot: Omit<Bot, "id" | "user_id" | "created_at" | "updated_at">
) {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData?.user?.id;
  if (!user_id) throw new Error("Usuário não autenticado");
  const { data, error } = await supabase
    .from("bots")
    .insert({ ...bot, user_id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBot(id: string, bot: Partial<Bot>) {
  const { data, error } = await supabase
    .from("bots")
    .update(bot)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBot(id: string) {
  const { error } = await supabase.from("bots").delete().eq("id", id);
  if (error) throw error;
}
