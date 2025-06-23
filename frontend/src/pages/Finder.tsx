import { useEffect, useState } from "react";
import type { Podroz } from "../lib/podroze";
import { fetchPodroze } from "../lib/podroze";
import { getCurrentUserId } from "../lib/auth";

export default function Finder() {
  const [userId, setUserId] = useState<string | null>(null);
  const [podroze, setPodroze] = useState<Podroz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserAndPodroze() {
      setLoading(true);
      const uid = await getCurrentUserId();
      if (uid) {
        setUserId(uid);
        const dane = await fetchPodroze(uid);
        setPodroze(dane);
      }
      setLoading(false);
    }

    loadUserAndPodroze();
  }, []);

  if (loading) return <div>Ładowanie danych...</div>;
  if (!userId) return <div>Nie jesteś zalogowany.</div>;
  if (podroze.length === 0) return <div>Brak zaplanowanych podróży.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white py-3 px-4 text-center">
        Finder!
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#d9d9d9] p-8 rounded-md min-h-[80vh]">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#212121]">
            Wybierz podróż
          </h1>
          <h2>Twoje podróże:</h2>
          <ul>
            {podroze.map((p) => (
              <li key={p.id_podrozy}>
                Z: {p.skad} do {p.dokad}
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <button
              onClick={() => {}}
              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700"
            >
              Szukaj pasażerów
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
