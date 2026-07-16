import { createContext, useContext } from "react";

export type UserRole = "client" | "advisor" | "admin";

export type AppUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  demo: boolean;
};

export type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return value;
}
