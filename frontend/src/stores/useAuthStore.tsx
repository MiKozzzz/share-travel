import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null, session: Session | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user, session) => set({ user, session, isLoading: false }),
  logout: async () => {
    await supabaseClient.auth.signOut();
    set({ user: null, session: null });
  },
}));
