import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { usePageMeta } from "@/hooks/usePageMeta";

const cgvSections = [
  ["1. Objet", "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Orée Entreprises et toute personne souhaitant bénéficier de ses services d'accompagnement à la création d'entreprise."],
  ["2. Services", "Orée Entreprises propose des services d'assistance administrative pour la constitution de dossiers d'immatriculation. Les formalités d'enregistrement relèvent des organismes compétents."],
  ["3. Tarifs", "Les prix sont indiqués en euros toutes taxes comprises (TTC). Ils comprennent nos honoraires ainsi que les frais de greffe et d'annonce légale, qui sont reversés à des tiers."],
  ["4. Responsabilité", "Nous mettons en œuvre tous les moyens nécessaires pour la bonne réalisation de votre dossier. Cependant, les délais externes d'enregistrement ne dépendent pas de nos services. Nos services ne constituent pas un conseil juridique personnalisé."],
  ["5. Rétractation", "Conformément à la réglementation, et compte tenu de la nature du service (personnalisé et exécuté immédiatement avec l'accord du client), le droit de rétractation peut ne pas s'appliquer une fois la prestation commencée."],
] as const;

export default function CgvPage() {
  usePageMeta("Conditions Générales de Vente", "Conditions Générales de Vente des services Orée Entreprises.");

  return (
    <>
      <section className="hero-grid surface-noise overflow-hidden bg-[var(--night)] pb-18 pt-34 text-white sm:pt-42 lg:pb-24 lg:pt-44">
        <div className="container-shell relative z-10 max-w-5xl">
          <Badge className="border-white/12 bg-white/[.06] text-white/68">Document à finaliser avant production</Badge>
          <div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-balance text-[clamp(3.5rem,7vw,7.8rem)] font-semibold leading-[.9] tracking-[-.075em]">Conditions Générales de Vente</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
                Dernière mise à jour : 16 juillet 2026. Ce contenu structure la page, mais doit être validé avec les informations juridiques et les coordonnées réelles du service.
              </p>
            </div>
            <span className="grid size-15 shrink-0 place-items-center rounded-[21px] border border-white/12 bg-white/[.06]">
              <ShieldCheck className="size-6 text-[color:var(--mint)]" />
            </span>
          </div>
        </div>
      </section>
      <section className="pb-28 pt-16 sm:pt-20">
        <div className="container-shell max-w-5xl">
          <div className="grid gap-4">
            {cgvSections.map(([heading, body], index) => (
              <article key={heading} className="interactive-card soft-panel grid gap-5 rounded-[28px] p-6 sm:grid-cols-[64px_1fr] sm:p-8">
                <span className="text-4xl font-semibold tracking-[-.07em] text-[color:var(--ink)]/[.07]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-.03em] sm:text-2xl">{heading}</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[color:var(--muted)] sm:text-base sm:leading-8">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
