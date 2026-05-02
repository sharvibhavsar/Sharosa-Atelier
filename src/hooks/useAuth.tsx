import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";

type AuthCtx = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null, isAdmin: false, loading: false, signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Read directly from localStorage on initial render
    return localStorage.getItem('adminAuth') === 'true';
  });
  const loading = false; // Never loading anymore since it's synchronous

  const signOut = async () => {
    localStorage.removeItem('adminAuth');
    setIsAdmin(false);
    window.location.href = "/auth";
  };

  return (
    <Ctx.Provider value={{ user: null, isAdmin, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
