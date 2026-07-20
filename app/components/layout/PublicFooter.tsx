import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

const groups: Array<{ title: string; links: Array<readonly [string, string]> }> = [
  { title: "Créer", links: [["Création SASU", "/creation-sasu"], ["Création EURL", "/creation-eurl"], ["Création SAS", "/creation-sas"], ["Création SARL", "/creation-sarl"]] },
  { title: "Votre situation", links: [["Choisir son statut", "/choisir-statut"], ["Créer en étant salarié", "/creer-entreprise-en-etant-salarie"], ["Passer de micro en société", "/passer-micro-entreprise-en-societe"], ["Créer à plusieurs", "/creer-entreprise-a-plusieurs"]] },
  { title: "Orée", links: [["Comment ça marche", "/comment-ca-marche"], ["Tarifs", "/tarifs"], ["Accompagnement", "/accompagnement"], ["Espace de démonstration", "/app"]] },
];

export function PublicFooter() {
  return (
    <footer className="relative z-[2] overflow-hidden bg-[var(--night)] pb-24 pt-8 text-white lg:pb-8">
      <div className="absolute inset-0 hero-grid opacity-45" />
      <div className="container-shell relative">
        <div className="relative mb-8 overflow-hidden rounded-[34px] border border-white/10 bg-white/[.055] p-6 backdrop-blur-xl sm:p-9 lg:p-12">
          <div className="absolute -right-24 -top-28 size-80 rounded-full bg-[var(--accent)]/25 blur-3xl" /><div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-[var(--mint)]/12 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-white/72"><Sparkles className="size-3 text-[color:var(--mint)]" />Votre prochaine étape</span><h2 className="mt-5 max-w-4xl text-balance text-3xl font-extrabold leading-[1] tracking-[-.058em] sm:text-5xl lg:text-6xl">Obtenez une orientation et une <span className="gradient-text">feuille de route structurée.</span></h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">Le diagnostic analyse d'abord votre situation, sans exiger de document au début du parcours.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><ButtonLink to="/diagnostic" variant="dark" size="lg" arrow>Démarrer le diagnostic</ButtonLink><ButtonLink to="/rendez-vous" variant="ghost" size="lg" className="border border-white/10 text-white hover:bg-white/8">Parler à l'équipe</ButtonLink></div>
          </div>
        </div>

        <div className="grid gap-12 border-b border-white/10 py-14 lg:grid-cols-[1.1fr_1.9fr]">
          <div>
            <Logo inverted variant="full" />
            <p className="mt-7 max-w-md text-pretty text-lg leading-8 text-white/72">Une plateforme pensée pour faire avancer un projet de société avec clarté, continuité et accompagnement humain.</p>
            <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-white/72"><ShieldCheck className="size-4 text-[color:var(--mint)]" />Données privées, consentement maîtrisé et accès contrôlés.</div>
            <ButtonLink to="/rendez-vous" variant="ghost" className="mt-8 border border-white/10 text-white hover:bg-white/8">Contacter l'équipe</ButtonLink>
          </div>
          <div className="grid gap-9 sm:grid-cols-3">{groups.map((group) => <div key={group.title}><h3 className="text-[11px] font-extrabold uppercase tracking-[.14em] text-white/72">{group.title}</h3><ul className="mt-5 space-y-1">{group.links.map(([label, href]) => <li key={href}><Link to={href} className="group flex items-center justify-between rounded-xl py-2.5 text-sm font-semibold text-white/72 transition hover:text-white"><span>{label}</span><ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" /></Link></li>)}</ul></div>)}</div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-white/72 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Orée. Version de démonstration : identité juridique, tarifs et coordonnées à confirmer avant publication.</p><div className="flex flex-wrap gap-5"><Link className="transition hover:text-white" to="/confidentialite">Confidentialité</Link><Link className="transition hover:text-white" to="/mentions-legales">Mentions légales</Link><Link className="group inline-flex items-center gap-1 transition hover:text-white" to="/diagnostic">Commencer <ArrowRight className="size-3 transition group-hover:translate-x-1" /></Link></div></div>
      </div>
    </footer>
  );
}
