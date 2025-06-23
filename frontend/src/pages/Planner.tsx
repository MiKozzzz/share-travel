import { CalendarView } from "@/components/CalendarView";

const Planner: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto px-4 mt-4">
        <div className="bg-primary text-white p-3 rounded-md text-center relative">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-primary text-2xl">
            ▲
          </span>
          Następna zaplanowana wspólna podróż: dzisiaj, 7:50, ul. Sienkiewicza
          12!
        </div>
      </div>

      <main className="container mx-auto px-4 mt-4 flex-1">
        <CalendarView />
      </main>
    </div>
  );
};

export default Planner;
