import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "@/components/ui/sonner";

const Main: React.FC = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Toaster />
    </main>
  );
};

export default Main;
