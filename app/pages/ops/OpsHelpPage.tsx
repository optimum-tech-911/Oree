import { BookOpenCheck, Bot, LifeBuoy, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";

const guides = [
  ["Qualifier une demande", "Vérifier l'intention, la maturité, le calendrier et les actions déjà réalisées avant toute affectation."],
  ["Contrôler un document", "Comparer la pièce aux exigences du dossier, consigner le motif précis et ne jamais valider sa propre action."],
  ["Traiter une correction", "Relier la demande au document concerné, préserver l'historique et indiquer l'action attendue en termes compréhensibles."],
  ["Protéger les données", "Limiter l'accès au rôle nécessaire, éviter toute donnée personnelle dans les outils publicitaires et utiliser des liens signés courts."],
] as const;

export default function OpsHelpPage() {
  usePageMeta("Aide opérations", "Consultez les procédures essentielles de traitement et de sécurité.");
  return <div className="mx-auto max-w-6xl space-y-6"><section className="hero-grid surface-noise rounded-[32px] bg-[var(--night)] p-7 text-white sm:p-10"><span className="grid size-13 place-items-center rounded-[18px] bg-[var(--mint)] text-[color:var(--ink)]"><LifeBuoy className="size-5" /></span><h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Procédures opérationnelles et règles de sécurité</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/72">Cette rubrique rassemble les principes indispensables au traitement cohérent des demandes, des projets et des documents.</p><Button variant="dark" className="mt-7" onClick={() => window.dispatchEvent(new CustomEvent("oree:assistant-open"))}><Bot className="size-4" />Interroger le Guide Orée</Button></section><div className="grid gap-4 md:grid-cols-2">{guides.map(([title, description], index) => <Card key={title} className="p-6"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-[16px] bg-[var(--mint-soft)]">{index === 3 ? <ShieldCheck className="size-5" /> : <BookOpenCheck className="size-5" />}</span><span className="text-xs font-semibold text-[color:var(--muted)]">0{index + 1}</span></div><h2 className="mt-6 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p></Card>)}</div></div>;
}
