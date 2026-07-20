import { useState, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Mail, Save, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/auth-context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { portalRepository, type PortalProfile } from "@/services/supabase/portal";

const emptyProfile: PortalProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  timezone: "Europe/Paris",
  availabilityNote: "",
  notificationPreferences: {},
};

export default function OpsProfilePage() {
  usePageMeta("Profil opérations", "Gérez les informations de présentation et les préférences du compte équipe.");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({ queryKey: ["portal", "snapshot"], queryFn: portalRepository.getSnapshot });
  const baseProfile = data?.profile ?? { ...emptyProfile, email: user?.email ?? "" };
  const [draftProfile, setDraftProfile] = useState<PortalProfile | null>(null);
  const profile = draftProfile ?? baseProfile;
  function setProfile(action: SetStateAction<PortalProfile>) {
    setDraftProfile(typeof action === "function" ? action(profile) : action);
  }
  const save = useMutation({
    mutationFn: () => portalRepository.saveProfile(profile),
    onSuccess: async () => {
      setDraftProfile(null);
      await queryClient.invalidateQueries({ queryKey: ["portal", "snapshot"] });
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="hero-grid surface-noise rounded-[32px] bg-[var(--night)] p-7 text-white sm:p-10">
        <span className="grid size-13 place-items-center rounded-[18px] bg-[var(--mint)] text-[color:var(--ink)]"><UserRound className="size-5" /></span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Profil du compte équipe</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72">Votre profil opérationnel est stocké dans Supabase. Il ne peut jamais accorder un rôle interne : les autorisations sont administrées séparément côté serveur.</p>
      </section>

      {error || save.error ? <Card className="border-[var(--blue)]/20 bg-[var(--blue)]/8 p-5 text-sm">{(error ?? save.error) instanceof Error ? (error ?? save.error as Error).message : "Action impossible"}</Card> : null}
      {save.isSuccess ? <Card className="border-[var(--mint)] bg-[var(--mint-soft)] p-4 text-sm font-semibold"><Check className="mr-2 inline size-4" />Profil enregistré.</Card> : null}

      <Card className="p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">Prénom
            <input disabled={isLoading} value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal outline-none focus:border-[var(--blue)]" />
          </label>
          <label className="text-sm font-semibold">Nom
            <input disabled={isLoading} value={profile.lastName} onChange={(event) => setProfile((current) => ({ ...current, lastName: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal outline-none focus:border-[var(--blue)]" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">Adresse de connexion
            <div className="relative mt-2"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" /><input readOnly type="email" value={profile.email} className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] pl-11 pr-4 font-normal" /></div>
          </label>
          <label className="text-sm font-semibold">Téléphone
            <input disabled={isLoading} value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal outline-none focus:border-[var(--blue)]" />
          </label>
          <label className="text-sm font-semibold">Fuseau horaire
            <input disabled={isLoading} value={profile.timezone} onChange={(event) => setProfile((current) => ({ ...current, timezone: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal outline-none focus:border-[var(--blue)]" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">Plages et contraintes de disponibilité
            <textarea disabled={isLoading} rows={4} value={profile.availabilityNote} onChange={(event) => setProfile((current) => ({ ...current, availabilityNote: event.target.value }))} placeholder="Ex. lundi au vendredi, 09:00–18:00" className="mt-2 w-full rounded-2xl border border-[var(--line)] p-4 font-normal outline-none focus:border-[var(--blue)]" />
          </label>
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-xs leading-5 text-[color:var(--muted)]"><ShieldCheck className="mt-0.5 size-4 shrink-0" />Rôle courant : <span className="font-bold capitalize text-[color:var(--ink)]">{user?.role ?? "non défini"}</span>. Il ne peut pas être modifié ici.</div>
          <Button onClick={() => save.mutate()} disabled={isLoading || save.isPending}><Save className="size-4" />{save.isPending ? "Enregistrement…" : "Enregistrer"}</Button>
        </div>
      </Card>
    </div>
  );
}
