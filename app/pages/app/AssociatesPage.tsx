import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AppPageHero } from "@/components/app/AppPageHero";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { portalRepository } from "@/services/supabase/portal";

const statusLabels: Record<string, string> = {
  pending: "À compléter",
  invited: "Invité",
  information_complete: "Informations complètes",
  verified: "Vérifié",
  changes_requested: "Correction demandée",
};

export default function AssociatesPage() {
  usePageMeta("Associés", "Gérez les fondateurs, les rôles et les participations du projet.");
  const queryClient = useQueryClient();
  const { data, error } = useQuery({ queryKey: ["portal", "snapshot"], queryFn: portalRepository.getSnapshot });
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", ownership: "", role: "Associé" });
  const addFounder = useMutation({
    mutationFn: async () => {
      if (!data?.project) throw new Error("Créez d’abord votre projet.");
      if (!form.firstName.trim() || !form.lastName.trim()) throw new Error("Le prénom et le nom sont requis.");
      const ownership = form.ownership === "" ? null : Number(form.ownership);
      if (ownership !== null && (!Number.isFinite(ownership) || ownership < 0 || ownership > 100)) throw new Error("La participation doit être comprise entre 0 et 100 %.");
      return portalRepository.addFounder(data.project.id, { firstName: form.firstName, lastName: form.lastName, email: form.email, ownershipPercentage: ownership, managementRole: form.role });
    },
    onSuccess: async () => {
      setForm({ firstName: "", lastName: "", email: "", ownership: "", role: "Associé" });
      setFormOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["portal", "snapshot"] });
    },
  });
  const founders = data?.founders ?? [];
  const totalOwnership = founders.reduce((sum, founder) => sum + (founder.ownershipPercentage ?? 0), 0);

  return <div className="mx-auto max-w-6xl space-y-5">
    <AppPageHero icon={UsersRound} eyebrow="Fondateurs et capital" title={<>Une vision exacte des <span className="gradient-text">parties prenantes.</span></>} description="Les fondateurs, leurs rôles et leur participation sont enregistrés dans le dossier. Une invitation d’accès distincte ne sera envoyée qu’après mise en place du canal transactionnel sécurisé." stat={{ value: String(founders.length), label: founders.length > 1 ? "Fondateurs" : "Fondateur" }} action={<Button variant="dark" onClick={() => setFormOpen((value) => !value)} disabled={!data?.project}><Plus className="size-4" />Ajouter un fondateur</Button>} />
    {error || addFounder.error ? <Card className="border-[var(--blue)]/20 bg-[var(--blue)]/8 p-5 text-sm">{(error ?? addFounder.error) instanceof Error ? (error ?? addFounder.error as Error).message : "Action impossible"}</Card> : null}
    {formOpen ? <Card className="p-5 sm:p-6"><h2 className="font-semibold">Nouveau fondateur</h2><p className="mt-1 text-xs text-[color:var(--muted)]">Cette action ajoute la personne au dossier ; elle ne crée pas automatiquement un compte utilisateur.</p><form onSubmit={(event) => { event.preventDefault(); addFounder.mutate(); }} className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Prénom<input required value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><label className="text-sm font-semibold">Nom<input required value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><label className="text-sm font-semibold">Email de contact<input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><label className="text-sm font-semibold">Participation envisagée (%)<input type="number" min="0" max="100" step="0.01" value={form.ownership} onChange={(event) => setForm((current) => ({ ...current, ownership: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><label className="text-sm font-semibold sm:col-span-2">Rôle envisagé<input value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="mt-2 h-12 w-full rounded-2xl border border-[var(--line)] px-4 font-normal" /></label><div className="flex gap-3 sm:col-span-2"><Button type="submit" disabled={addFounder.isPending}>{addFounder.isPending ? "Ajout…" : "Ajouter au dossier"}</Button><Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Annuler</Button></div></form></Card> : null}
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card className="p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[color:var(--muted)]">Données du dossier</p><h3 className="mt-2 text-xl font-semibold">Fondateurs déclarés</h3></div><span className="rounded-full bg-[var(--paper)] px-3 py-1.5 text-xs font-bold text-[color:var(--muted)]">{founders.length}</span></div><div className="mt-6 space-y-4">{founders.length ? founders.map((founder) => <article key={founder.id} className="rounded-[24px] border border-[var(--line)] bg-white p-5"><div className="flex items-start gap-4"><span className="grid size-13 shrink-0 place-items-center rounded-[18px] bg-[var(--mint)] text-sm font-bold">{`${founder.firstName[0] ?? ""}${founder.lastName[0] ?? ""}`.toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold">{founder.firstName} {founder.lastName}</h4><span className="rounded-full bg-[var(--paper)] px-2.5 py-1 text-[10px] font-bold">{statusLabels[founder.verificationStatus]}</span></div><p className="mt-1 text-sm text-[color:var(--muted)]">{founder.managementRole}{founder.email ? ` · ${founder.email}` : ""}</p></div><strong>{founder.ownershipPercentage === null ? "—" : `${founder.ownershipPercentage} %`}</strong></div></article>) : <div className="rounded-[24px] border border-dashed border-[var(--line)] p-8 text-center"><UserRound className="mx-auto size-6 text-[color:var(--muted)]" /><h4 className="mt-4 font-semibold">Aucun fondateur renseigné</h4><p className="mt-2 text-sm text-[color:var(--muted)]">Ajoutez les personnes concernées pour préparer la structure du capital.</p></div>}</div></Card>
      <div className="space-y-5"><Card className="p-5"><ShieldCheck className="size-5 text-[color:var(--blue)]" /><h3 className="mt-4 font-semibold">Séparation des droits</h3><div className="mt-4 space-y-3">{["Une fiche fondateur ne crée aucun accès.", "Les comptes sont liés après invitation et acceptation.", "Les validations restent réservées aux rôles autorisés."].map((item) => <div key={item} className="flex gap-2 text-sm leading-6 text-[color:var(--muted)]"><Check className="mt-1 size-4 shrink-0" />{item}</div>)}</div></Card><Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[color:var(--muted)]">Répartition renseignée</p><div className="mt-5 h-4 overflow-hidden rounded-full bg-[var(--paper)]"><div className="h-full rounded-full bg-[var(--mint)]" style={{ width: `${Math.min(totalOwnership, 100)}%` }} /></div><div className="mt-4 flex items-center justify-between text-sm"><span>Total</span><strong>{totalOwnership.toFixed(totalOwnership % 1 ? 2 : 0)} %</strong></div><p className={`mt-4 text-xs leading-5 ${totalOwnership > 100 ? "text-[color:var(--blue)]" : "text-[color:var(--muted)]"}`}>{totalOwnership > 100 ? "La somme dépasse 100 % et doit être corrigée avant validation." : "La répartition sera contrôlée avant la finalisation du dossier."}</p></Card></div>
    </div>
  </div>;
}
