import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import { safeStorage } from "@/lib/storage";
import { AuthContext, type AppUser, type AuthContextValue, type UserRole } from "@/features/auth/auth-context";
import { createId } from "@/lib/id";
const DEMO_KEY = "oree:demo-user:v1";

async function resolveUser(user: User): Promise<AppUser> {
  let role: UserRole = "client";

  if (supabase) {
    const { data, error } = await supabase
      .from("staff_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();

    if (!error && (data?.role === "advisor" || data?.role === "admin")) {
      role = data.role;
    }
  }

  return {
    id: user.id,
    email: user.email ?? "",
    firstName: (user.user_metadata.first_name as string | undefined) ?? "Utilisateur",
    lastName: (user.user_metadata.last_name as string | undefined) ?? "Orée",
    role,
    demo: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (isSupabaseConfigured || typeof window === "undefined") return null;
    const saved = safeStorage.get(DEMO_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as AppUser;
    } catch {
      safeStorage.remove(DEMO_KEY);
      return null;
    }
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;

    void supabase.auth.getUser().then(async ({ data }) => {
      const nextUser = data.user ? await resolveUser(data.user) : null;
      if (active) {
        setUser(nextUser);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        const nextUser = session?.user ? await resolveUser(session.user) : null;
        if (active) {
          setUser(nextUser);
          setLoading(false);
        }
      })();
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async signIn(email, password) {
      if (!isSupabaseConfigured || !supabase) {
        const demoUser: AppUser = {
          id: "demo-user",
          email,
          firstName: "Utilisateur",
          lastName: "Démo",
          role: email.includes("ops") ? "advisor" : "client",
          demo: true,
        };
        safeStorage.set(DEMO_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }
      if (password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
      }
    },
    async signUp(email, password) {
      if (!isSupabaseConfigured || !supabase) {
        const demoUser: AppUser = {
          id: "demo-user",
          email,
          firstName: "Nouveau",
          lastName: "Créateur",
          role: "client",
          demo: true,
        };
        safeStorage.set(DEMO_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password: password ?? createId(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    },
    async resetPassword(email) {
      if (!isSupabaseConfigured || !supabase) {
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
      });
      if (error) throw error;
    },
    async updatePassword(password) {
      if (!isSupabaseConfigured || !supabase) {
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
    async signOut() {
      if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
      safeStorage.remove(DEMO_KEY);
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
