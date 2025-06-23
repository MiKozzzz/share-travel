import { useAuthStore } from "@/stores/useAuthStore";

import LandingPageLogged from "./LandingPageLogged";
import LandingPageUnlogged from "./LandingPageUnlogged";

const LandingPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  return user ? <LandingPageLogged /> : <LandingPageUnlogged />;
};

export default LandingPage;
