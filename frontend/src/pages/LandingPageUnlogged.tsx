import { Link } from "react-router-dom";
import RotatingText from "@/components/ui/rotatingText";

const LandingPageUnlogged: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-[#d9d9d9] rounded p-8 min-h-[500px] flex flex-col">
          <div className="p-4">
            <div className="p-4 text-center space-y-4 flex flex-col items-center">
              <div className="flex gap-x-5 items-center text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[#18191f]">
                  Save
                </h1>
                <RotatingText
                  texts={["Money", "Time", "Planet"]}
                  mainClassName="text-3xl md:text-4xl font-bold text-[#18191f] px-2 sm:px-2 md:px-3 bg-primary text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={3000}
                />
              </div>
              <h2 className="text-lg md:text-xl text-gray-700">
                The social ride-sharing app for students and commuters.
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                ShareTravel connects people heading in the same direction — like
                a mix of Tinder and Uber, but for carpooling. Whether you're
                going to university or commuting to work, find someone to ride
                with, reduce the number of cars on the road, and make the
                journey more social and sustainable.
              </p>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="bg-white text-primary px-8 py-4 rounded text-center min-w-[150px]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-8 py-4 rounded text-center min-w-[150px]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPageUnlogged;
