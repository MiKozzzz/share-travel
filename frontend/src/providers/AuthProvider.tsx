import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabaseClient } from "@/lib/supabase";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (session) {
        setUser(session.user, session);
        console.log(session.user);
      } else {
        setUser(null, null);
      }
    };
    fetchSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user, session);
      } else {
        setUser(null, null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
};
