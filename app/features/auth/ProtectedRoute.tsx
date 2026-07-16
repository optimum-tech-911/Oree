import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PageLoader } from "@/components/ui/PageLoader";
import { useAuth, type UserRole } from "@/features/auth/auth-context";
import { isSupabaseConfigured } from "@/services/supabase/client";

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // The downloadable project stays immediately inspectable until real Supabase keys are supplied.
  if (!isSupabaseConfigured) return children;
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/app" replace />;

  return children;
}
