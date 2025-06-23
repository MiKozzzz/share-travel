import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Offer: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const [skad, setSkad] = useState("");
  const [dokad, setDokad] = useState("");
  const [d_o_ktorej_najpozniej, setD_o_ktorej_najpozniej] = useState("");
  const [d_o_ktorej_najwczesniej, setD_o_ktorej_najwczesniej] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      }

      if (user) {
        setUserId(user.id); // UUID użytkownika
      } else {
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  // teraz userId możesz użyć w handleSubmit do zapisu
  const handleSubmit = async () => {
    if (!userId) {
      alert("Musisz być zalogowany!");
      return;
    }

    const { error } = await supabase.from("zaplanowane_podroze").insert([
      {
        skad,
        dokad,
        d_o_ktorej_najpozniej,
        d_o_ktorej_najwczesniej,
        id_uzytkownika: userId,  // zakładam, że masz kolumnę user_id w tabeli
      },
    ]);

    if (error) {
      alert("Błąd zapisu: " + error.message);
    } else {
      alert("Podróż została zapisana!");
      // wyczyść formularz
      setSkad("");
      setDokad("");
      setD_o_ktorej_najpozniej("");
      setD_o_ktorej_najwczesniej("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white py-3 px-4 text-center">
        Następna zaplanowana wspólna podróż: dzisiaj, 7:30, ul. Sienkiewicza 12!
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#d9d9d9] p-8 rounded-md min-h-[80vh]">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#212121]">
            Kierowca - dodawanie nowej podróży
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Skad */}
            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj skad
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  value={skad}
                  onChange={(e) => setSkad(e.target.value)}
                  placeholder="np. ul. Rozpoczęcia"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>

            {/* Dokad */}
            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj dokad
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  value={dokad}
                  onChange={(e) => setDokad(e.target.value)}
                  placeholder="np. ul. Docelowa"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>

            {/* d_o_ktorej_najpozniej */}
            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj d_o_ktorej_najpozniej
              </button>
              <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  value={d_o_ktorej_najpozniej}
                  onChange={(e) => setD_o_ktorej_najpozniej(e.target.value)}
                  placeholder="np. 7:00"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>

            {/* d_o_ktorej_najpozniej */}
            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj D_o_ktorej_najwczesniej
              </button>
              <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  value={d_o_ktorej_najwczesniej}
                  onChange={(e) => setD_o_ktorej_najwczesniej(e.target.value)}
                  placeholder="np. 7:00"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Przycisk zapisu */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700"
            >
              Zapisz podróż
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Offer;
