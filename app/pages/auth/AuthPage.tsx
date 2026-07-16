import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/features/auth/auth-context";
import { isSupabaseConfigured } from "@/services/supabase/client";
import { analytics } from "@/services/analytics";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function AuthPage({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const [email, setEmail] = useState("sid@example.fr");
  const [password, setPassword] = useState("demo-password");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const register = mode === "register";
  const forgot = mode === "forgot";
  const reset = mode === "reset";
  const pageTitle = register ? "Créer mon espace" : forgot ? "Mot de passe oublié" : reset ? "Définir un nouveau mot de passe" : "Se connecter";
  usePageMeta(pageTitle, register ? "Créez votre espace projet Orée." : forgot ? "Demandez un lien sécurisé pour réinitialiser votre mot de passe." : reset ? "Définissez un nouveau mot de passe pour votre compte." : "Connectez-vous à votre espace projet Orée.");

  async function submit(useMagic = false) {
    setLoading(true); setError(null);
    try {
      if (useMagic) {
        await signIn(email);
        if (isSupabaseConfigured) setMagicSent(true); else navigate("/app");
      } else {
        if (register) await signUp(email, password); else await signIn(email, password);
        analytics.track(register ? "account_created" : "assistant_search", { method: "password" });
        navigate("/app");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de poursuivre.");
    } finally { setLoading(false); }
  }

  async function requestPasswordReset() {
    setLoading(true); setError(null);
    try {
      await resetPassword(email);
      setCompleted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La demande n'a pas pu être enregistrée.");
    } finally { setLoading(false); }
  }

  async function saveNewPassword() {
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins huit caractères."); return; }
    if (password !== confirmation) { setError("Les deux mots de passe ne correspondent pas."); return; }
    setLoading(true); setError(null);
    try {
      await updatePassword(password);
      setCompleted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le mot de passe n'a pas pu être modifié.");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-[1.03fr_.97fr]">
      <div className="hero-grid surface-noise relative hidden overflow-hidden bg-[var(--night)] p-10 text-white lg:flex lg:min-h-screen lg:flex-col xl:p-14">
        <div className="glow-mint -bottom-48 -right-44 opacity-70" />
        <div className="relative z-10"><Logo inverted /></div>
        <div className="relative z-10 my-auto max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.06] px-3 py-1.5 text-xs font-semibold text-white/62"><Sparkles className="size-3.5 text-[color:var(--mint)]" />Votre espace projet</span><h1 className="mt-7 text-balance text-[clamp(4rem,6vw,7.5rem)] font-semibold leading-[.89] tracking-[-.075em]">Retrouvez votre dossier <span className="gradient-text">dans son dernier état.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-white/72">Les documents, les messages, les décisions, les rendez-vous et les prochaines étapes sont réunis dans un même espace de suivi.</p><div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">{["Projet synchronisé", "Documents privés", "Suivi contextualisé"].map((item, index) => <div key={item} className="rounded-[20px] border border-white/[.08] bg-white/[.035] p-4"><span className="grid size-8 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-3.5" /></span><p className="mt-4 text-xs font-semibold leading-5 text-white/68">{item}</p><span className="mt-2 block text-[10px] text-white/72">0{index + 1}</span></div>)}</div></div>
        <div className="relative z-10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[.12em] text-white/72"><span>Authentification sécurisée</span><span>Accès limités selon les rôles</span></div>
      </div>

      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_100%_0%,rgba(36,87,255,.1),transparent_28rem),var(--paper)]">
        <div className="flex items-center justify-between p-5 sm:p-7"><Link to="/" className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"><ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />Retour au site</Link><div className="lg:hidden"><Logo compact /></div><span className="hidden rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[color:var(--muted)] sm:block">Espace sécurisé</span></div>
        <div className="mx-auto my-auto w-full max-w-[540px] px-5 py-10 sm:px-8">
          <div className="soft-panel rounded-[36px] p-6 sm:p-9">
            {completed ? <div className="py-6 text-center"><span className="mx-auto grid size-17 place-items-center rounded-[23px] bg-[var(--mint)]"><Check className="size-7" /></span><h1 className="mt-7 text-4xl font-semibold tracking-[-.055em]">{reset ? "Mot de passe modifié" : "Demande enregistrée"}</h1><p className="mt-4 text-base leading-7 text-[color:var(--muted)]">{reset ? "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe." : `Si un compte correspond à ${email}, un lien sécurisé lui sera envoyé.`}</p><Button className="mt-7" onClick={() => navigate("/connexion")}>Revenir à la connexion</Button></div> : forgot ? <>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[color:var(--accent)]">Récupération du compte</p><h1 className="mt-3 text-balance text-4xl font-semibold leading-[.97] tracking-[-.06em] sm:text-5xl">Réinitialisez votre mot de passe.</h1><p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">Indiquez l'adresse associée à votre compte. Pour des raisons de sécurité, la confirmation ne précisera pas si cette adresse est enregistrée.</p>
              <form onSubmit={(event) => { event.preventDefault(); void requestPasswordReset(); }} className="mt-8 space-y-5"><label className="block text-sm font-semibold">Adresse email<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 w-full rounded-[18px] border border-[var(--line)] bg-white/82 pl-11 pr-4 font-normal outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/8" /></div></label>{error ? <div className="rounded-[18px] border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-4 text-sm font-semibold text-[color:var(--blue)]">{error}</div> : null}<Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : null}Envoyer le lien sécurisé</Button></form><p className="mt-7 text-center text-sm text-[color:var(--muted)]"><Link to="/connexion" className="font-bold text-[color:var(--ink)] underline decoration-[var(--mint)] decoration-2 underline-offset-4">Revenir à la connexion</Link></p>
            </> : reset ? <>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[color:var(--accent)]">Sécurité du compte</p><h1 className="mt-3 text-balance text-4xl font-semibold leading-[.97] tracking-[-.06em] sm:text-5xl">Définissez un nouveau mot de passe.</h1><p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">Choisissez un mot de passe d'au moins huit caractères et conservez-le dans un gestionnaire sécurisé.</p>
              <form onSubmit={(event) => { event.preventDefault(); void saveNewPassword(); }} className="mt-8 space-y-5"><label className="block text-sm font-semibold">Nouveau mot de passe<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-14 w-full rounded-[18px] border border-[var(--line)] bg-white/82 px-4 font-normal outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/8" /></label><label className="block text-sm font-semibold">Confirmation<input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 h-14 w-full rounded-[18px] border border-[var(--line)] bg-white/82 px-4 font-normal outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/8" /></label>{error ? <div className="rounded-[18px] border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-4 text-sm font-semibold text-[color:var(--blue)]">{error}</div> : null}<Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : null}Enregistrer le nouveau mot de passe</Button></form>
            </> : magicSent ? <div className="py-6 text-center"><span className="animate-pulse-ring mx-auto grid size-17 place-items-center rounded-[23px] bg-[var(--mint)]"><Mail className="size-7" /></span><h1 className="mt-7 text-4xl font-semibold tracking-[-.055em]">Consultez votre messagerie.</h1><p className="mt-4 text-base leading-7 text-[color:var(--muted)]">Un lien de connexion à usage limité a été envoyé à <strong>{email}</strong>.</p><Button className="mt-7" variant="secondary" onClick={() => setMagicSent(false)}>Utiliser un mot de passe</Button></div> : <>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[color:var(--accent)]">{register ? "Créer mon espace" : "Bienvenue"}</p><h1 className="mt-3 text-balance text-4xl font-semibold leading-[.97] tracking-[-.06em] sm:text-5xl">{register ? "Enregistrez votre projet." : "Retrouvez votre projet."}</h1><p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{isSupabaseConfigured ? "Connexion sécurisée avec Supabase Auth." : "Mode démonstration actif : utilisez n'importe quel email et mot de passe."}</p>
              <form onSubmit={(event) => { event.preventDefault(); void submit(false); }} className="mt-8 space-y-5">
                <label className="block text-sm font-semibold">Adresse email<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 w-full rounded-[18px] border border-[var(--line)] bg-white/82 pl-11 pr-4 font-normal outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/8" /></div></label>
                <label className="block text-sm font-semibold">Mot de passe<div className="relative mt-2"><LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" /><input type={show ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 w-full rounded-[18px] border border-[var(--line)] bg-white/82 pl-11 pr-12 font-normal outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/8" /><button type="button" aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShow((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] transition hover:text-[color:var(--ink)]">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>{!register ? <span className="mt-2 block text-right"><Link to="/mot-de-passe-oublie" className="text-xs font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]">Mot de passe oublié ?</Link></span> : null}</label>
                {error ? <div className="rounded-[18px] border border-[var(--blue)]/20 bg-[var(--blue)]/8 p-4 text-sm font-semibold text-[color:var(--blue)]">{error}</div> : null}
                <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : null}{register ? "Créer mon espace" : "Se connecter"}</Button>
              </form>
              <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-[var(--line)]" /><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--muted)]">ou</span><span className="h-px flex-1 bg-[var(--line)]" /></div>
              <Button variant="secondary" size="lg" className="w-full" onClick={() => void submit(true)} disabled={loading}><Mail className="size-4" />Recevoir un lien magique</Button>
              <div className="mt-6 flex items-start gap-3 rounded-[19px] border border-[var(--mint)]/20 bg-[var(--mint-soft)] p-4"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><p className="text-xs leading-5 text-[color:var(--muted)]">Les rôles équipe sont gérés côté serveur. Une inscription publique ne peut jamais attribuer un rôle administrateur.</p></div>
              <p className="mt-7 text-center text-sm text-[color:var(--muted)]">{register ? "Vous avez déjà un compte ?" : "Vous n'avez pas encore d'espace ?"} <Link to={register ? "/connexion" : "/inscription"} className="font-bold text-[color:var(--ink)] underline decoration-[var(--mint)] decoration-2 underline-offset-4">{register ? "Se connecter" : "Créer un compte"}</Link></p>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
