import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { supabase } from "@/services/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = window.setTimeout(() => navigate("/app", { replace: true }), 800);
    if (supabase) supabase.auth.getSession().finally(() => navigate("/app", { replace: true }));
    return () => window.clearTimeout(timeout);
  }, [navigate]);
  return <div className="hero-grid surface-noise grid min-h-screen place-items-center bg-[var(--night)] p-5 text-white"><div className="relative z-10 text-center"><div className="mx-auto w-fit"><Logo inverted /></div><div className="glass-panel mx-auto mt-10 max-w-sm rounded-[30px] p-8"><span className="mx-auto grid size-15 place-items-center rounded-[21px] bg-[var(--mint)] text-[color:var(--ink)]"><LoaderCircle className="size-6 animate-spin" /></span><p className="mt-6 text-xl font-semibold tracking-[-.035em]">Connexion sécurisée en cours…</p><p className="mt-3 text-sm leading-6 text-white/72">Nous vérifions votre session avant d'ouvrir l'espace projet.</p><div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-white/72"><ShieldCheck className="size-3.5 text-[color:var(--mint)]" />Supabase Auth</div></div></div></div>;
}
