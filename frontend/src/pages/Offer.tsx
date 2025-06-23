import { Minus, Plus } from "lucide-react";

const Offer: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white py-3 px-4 text-center">
        Następna zaplanowana wspólna podróż: dzisiaj, 7:30, ul. Sienkiewicza 12!
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#d9d9d9] p-8 rounded-md h-screen">
          <h1 className="text-2xl font-semibold text-center mb-8 text-[#212121]">
            Kierowca - dodawanie nowej podróży
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj termin podróży
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Label"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj pojazd
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Nazwa"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj ilość miejsc
              </button>
              <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden">
                <button className="px-4 py-2 text-primary">
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  value="1"
                  className="flex-1 text-center py-2 border-none focus:outline-none"
                  readOnly
                />
                <button className="px-4 py-2 text-primary">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md flex flex-col items-center">
              <button className="bg-primary text-white py-3 px-6 rounded-md w-full mb-6 hover:bg-[#3d9c3f]">
                Podaj cenę
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cena"
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
                />
                <Plus
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Offer;
