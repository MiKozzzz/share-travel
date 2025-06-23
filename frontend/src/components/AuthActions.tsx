import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import UserMenu from "./UserMenu";

const AuthActions = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="text-primary hover:text-[#3d8c3f] transition-colors"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-[#3d8c3f] transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return <UserMenu />;
};

export default AuthActions;
