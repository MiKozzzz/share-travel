const LandingPageLogged: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6">
        <div className="bg-primary text-white p-4 rounded-md mb-6">
          <p>
            Następna zaplanowana wspólna podróż: dzisiaj, 7:30, ul. Sienkiewicza
            12!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#d9d9d9] p-6 rounded-md">
            <h2 className="text-lg font-medium mb-4">
              Twój planer - w mniejszej wersji - po kliknięciu przechodzimy do
              dedykowanej podstory
            </h2>

            <div className="bg-white p-4 rounded-md mb-6">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button className="bg-primary text-white p-3 rounded-md hover:bg-primary/90">
                  &nbsp;
                </button>
                <button className="bg-primary text-white p-3 rounded-md hover:bg-primary/90">
                  &nbsp;
                </button>
                <button className="bg-primary text-white p-3 rounded-md hover:bg-primary/90">
                  &nbsp;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="bg-primary text-white p-3 rounded-md hover:bg-primary/90">
                  &nbsp;
                </button>
                <button className="bg-primary text-white p-3 rounded-md hover:bg-primary/90">
                  &nbsp;
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button className="bg-primary text-white p-3 rounded-md w-1/3 hover:bg-primary/90">
                  &nbsp;
                </button>
              </div>
            </div>

            <button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 w-full md:w-auto">
              Dodaj nową podróż - przekierowauję do dodawania podróży
            </button>
          </div>

          <div className="md:col-span-1 bg-[#d9d9d9] p-6 rounded-md">
            <h2 className="text-lg font-medium mb-4">
              Komunikacja - rozmowy zaproszenia
            </h2>

            <div className="space-y-4">
              <button className="bg-white w-full p-4 rounded-full text-left hover:bg-gray-50">
                Nowe zaproszenie
              </button>
              <button className="bg-white w-full p-4 rounded-full text-left hover:bg-gray-50">
                Ktoś tam napisał
              </button>
              <button className="bg-white w-full p-4 rounded-full text-left hover:bg-gray-50">
                &nbsp;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPageLogged;
