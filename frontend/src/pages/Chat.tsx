import { ArrowLeft, MoreHorizontal } from "lucide-react";

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-primary text-white py-3 text-center relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <div className="h-2 w-4 border-l-2 border-r-2 border-b-2 border-white rotate-180"></div>
          </div>
        </div>
        Następna zaplanowana wspólna podróż: dzisiaj, 7:40, ul. Sienkiewicza 12!
      </div>

      <div className="flex-1 flex">
        <div className="w-1/3 bg-[#f5f7fa] border-r border-gray-200 p-4 flex flex-col">
          <div className="flex items-center mb-6">
            <ArrowLeft className="text-gray-500 mr-2" />
          </div>

          <button className="bg-primary text-white py-3 px-4 rounded-full mb-8 text-center">
            Nowe zaproszenie
          </button>

          <div className="mb-4">
            <h3 className="text-[#18191f] mb-2">Znajomi:</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-full py-3 px-4">
              Ktoś tam napisał
            </div>
            <div className="bg-white rounded-full py-3 px-4">&nbsp;</div>
            <div className="bg-white rounded-full py-3 px-4">&nbsp;</div>
            <div className="bg-white rounded-full py-3 px-4">&nbsp;</div>
          </div>
        </div>

        <div className="w-2/3 bg-[#f5f7fa] p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-[#18191f] text-lg">Ktoś tam</h2>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto mb-4">
            <div className="max-w-[80%]">
              <div className="bg-primary text-white p-4 rounded-2xl">
                <p>
                  Nowa zaproszenie! XYZ zaprasza Cię do wspólnej podróży w
                  czwartki o 7:30 ...... .....
                </p>
                <p>..... .....</p>
              </div>

              <div className="mt-2">
                <button className="bg-primary text-white py-3 px-4 rounded-full">
                  Kliknij by zobaczyć w planerze!
                </button>
              </div>
            </div>

            <div className="bg-white rounded-full py-3 px-4 mt-auto">
              Hej! Coś tam coś tam...........
            </div>

            <div className="h-20"></div>

            <div className="bg-white rounded-full p-4 flex items-center justify-between">
              <span>Chcesz zaakceptować przejazd?</span>
              <div className="flex space-x-2">
                <button className="bg-[#d9d9d9] text-[#18191f] py-2 px-8 rounded-full">
                  Odrzuć
                </button>
                <button className="bg-primary text-white py-2 px-8 rounded-full">
                  Akceptuj!
                </button>
              </div>
            </div>

            <div className="bg-white rounded-full p-4 flex items-center justify-between">
              <span>&nbsp;</span>
              <MoreHorizontal className="text-[#18191f]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
