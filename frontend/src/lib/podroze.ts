import { supabaseClient } from "./supabase";

export type Podroz = {
  id_podrozy: string;
  skad: string;
  dokad: string;
  // inne pola według tabeli
};

export async function fetchPodroze(userId: string): Promise<Podroz[]> {
  const { data, error } = await supabaseClient
    .from("zaplanowane_podroze")
    .select("*")
    // .eq("id_uzytkownika", userId);

  if (error) {
    console.error("Błąd pobierania podróży:", error);
    return [];
  }
  console.log("userId:", userId); // <-- TUTAJ wyświetlisz wartość
  return data || [];
}
