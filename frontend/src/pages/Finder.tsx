import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Offer: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [skad, setSkad] = useState("");
  const [dokad, setDokad] = useState("");
  const [d_o_ktorej_najpozniej, setD_o_ktorej_najpozniej] = useState("");
  const [s_o_ktorej_najwczesniej, setS_o_ktorej_najwczesniej] = useState("");

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
        s_o_ktorej_najwczesniej,
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
      setS_o_ktorej_najwczesniej("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white py-3 px-4 text-center">
        Finder!
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#d9d9d9] p-8 rounded-md min-h-[80vh]">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#212121]">
            Dodawanie nowej podróży
          </h1>
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