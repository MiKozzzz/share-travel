import type { AuthMode } from "@/types/auth";

import LogIn from "@/components/LogIn";
import SignUp from "@/components/SignUp";

interface SignInPageProps {
  authMode: AuthMode;
}

const SignInPage: React.FC<SignInPageProps> = ({ authMode }) => {
  return authMode === "login" ? <LogIn /> : <SignUp />;
};

export default SignInPage;
