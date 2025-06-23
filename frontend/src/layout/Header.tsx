import AuthActions from "@/components/AuthActions";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header className="container mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex-shrink-0">
      <Link to="">
        <img
          src="/logo.svg"
          alt="ShareTravel"
          width={200}
          height={60}
          className="h-10 w-auto"
        />
      </Link>
    </div>

    <nav className="hidden md:flex items-center space-x-8">
      <Link
        to="/"
        className="text-[#18191f] hover:text-primary transition-colors"
      >
        Home
      </Link>
      <Link
        to="/planner"
        className="text-[#18191f] hover:text-primary transition-colors"
      >
        Planner
      </Link>
      <Link
        to="/chat"
        className="text-[#18191f] hover:text-primary transition-colors"
      >
        Friends
      </Link>
      <Link
        to="/offer"
        className="text-[#18191f] hover:text-primary transition-colors"
      >
        Dodawanie podróży
      </Link>
      <Link
        to="/finder"
        className="text-[#18191f] hover:text-primary transition-colors"
      >
        Szukanie osób do wspólnej jazdy
      </Link>
      <Link
        to="/faq"
        className="text-[#18191f] hover:text-primary transition-colors"
      >
        FAQ
      </Link>
    </nav>

    <AuthActions />
  </header>
);

export default Header;
