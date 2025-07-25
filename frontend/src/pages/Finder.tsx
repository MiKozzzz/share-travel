import { useEffect, useState } from "react";
import type { Podroz } from "../lib/podroze";
import { fetchPodroze } from "../lib/podroze";
import { getCurrentUserId } from "../lib/auth";
// import MapaTrasy from "@/components/MapaTrasy";
import MapaTrasyORS from "@/components/MapaTrasyORS";



export default function Finder() {
  const [userId, setUserId] = useState<string | null>(null);
  const [podroze, setPodroze] = useState<Podroz[]>([]);
  const [loading, setLoading] = useState(true);
  const [szukanie, setSzukanie] = useState(false);
  const [czySzukano, setCzySzukano] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [odpowiedzBackendu, setOdpowiedzBackendu] = useState<any[]>([]);
  const [selectedDetailsIndex, setSelectedDetailsIndex] = useState<number | null>(null);

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
          <h2 className="mb-4 text-lg font-medium">Twoje podróże:</h2>
          <ul className="space-y-2">
            {podroze.map((p) => (
              <li
                key={p.id_podrozy}
                className={`p-4 rounded-lg cursor-pointer border ${
                  selectedId === p.id_podrozy
                    ? "bg-green-200 border-green-500"
                    : "bg-white border-gray-300"
                }`}
                onClick={() => setSelectedId(p.id_podrozy)}
              >
                <strong>Z:</strong> {p.skad} <strong>do:</strong> {p.dokad}
              </li>
            ))}
          </ul>

          {/* Przycisk szukania */}
          <div className="mt-8 text-center">
            <button
                onClick={async () => {
                  setCzySzukano(true);
                  if (selectedId) {
                    const wybrana = podroze.find((p) => p.id_podrozy === selectedId);
                    alert(`Wybrano podróż: ${wybrana?.skad} → ${wybrana?.dokad}`);

                    setSzukanie(true); // start ładowania
                    try {
                      const res = await fetch("http://127.0.0.1:8000/wybierz-podroz", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id_podrozy: selectedId }),
                      });

                      const data = await res.json();
                      console.log("Odpowiedź backendu:", data);
                      setOdpowiedzBackendu(data);
                    } catch (err) {
                      console.error("Błąd fetch:", err);
                    } finally {
                      setSzukanie(false); // koniec ładowania
                    }
                  } else {
                    alert("Wybierz podróż przed kontynuacją.");
                  }
                }}

              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700"
            >
              Szukaj pasażerów
            </button>
            {szukanie && (<p className="text-center my-4 text-gray-600">⏳ Szukanie pasażerów...</p>)}
            {czySzukano && !szukanie && odpowiedzBackendu.length === 0 && (
              <p className="text-center my-4 text-gray-600">🔍 Brak pasujących pasażerów.</p>
            )}
            {!szukanie && odpowiedzBackendu.length > 0 && odpowiedzBackendu.slice(0, 3).map((element, index) => {
              const [Imie, details, metryki, punkty_trasy, nazwy_przystankow] = element;
              const [, km_trasy, czas_trasy, distList, czasList] = details;
              console.log("Punkty trasy:", punkty_trasy);
              const safePunktyTrasy =
                punkty_trasy && Array.isArray(punkty_trasy.punkty_trasy)
                  ? punkty_trasy.punkty_trasy
                  : [];
              // const poprawionePunkty = safePunktyTrasy.map(([lng, lat]: [number, number]) => [lat, lng]);
              console.log("Punkty trasy:", safePunktyTrasy);
              return (
                <li key={index} className="bg-white rounded shadow p-4">
                  <p><strong>Pasażer:</strong> {Imie}</p>
                  <p><strong>Długość trasy:</strong> {km_trasy} km</p>
                  <p><strong>Czas trasy:</strong> {czas_trasy} min</p>

                  <button
                    className="text-blue-600 underline mt-2"
                    onClick={() => setSelectedDetailsIndex(index === selectedDetailsIndex ? null : index)}
                  >
                    {selectedDetailsIndex === index ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                  </button>

                  {selectedDetailsIndex === index && (
                    <div className="mt-4 bg-gray-100 p-4 rounded text-sm">
                      <h4 className="font-semibold mb-2">Zobacz trasę na mapie:</h4>
                      <MapaTrasyORS 
                        punkty_trasy={safePunktyTrasy} 
                        przystanki={nazwy_przystankow} 
                      />
                      <h4 className="font-semibold mt-4 mb-2">Długości odcinków (km):</h4>
                      <p>{JSON.stringify(distList)}</p>

                      <h4 className="font-semibold mt-4 mb-2">Czasy odcinków (min):</h4>
                      <p>{JSON.stringify(czasList)}</p>

                      <h4 className="font-semibold mt-4 mb-2">Metryki:</h4>
                      <ul className="list-disc list-inside">
                        {Object.entries(metryki).map(([key, val]) => (
                          <li key={key}><strong>{key}:</strong> {String(val)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
