import { supabaseClient } from "./supabase";

export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.error("Błąd pobierania użytkownika:", error);
    return null;
  }
  return data?.user?.id ?? null;
}
