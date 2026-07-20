import { Building2, Scale, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/marketing/Reveal";

const responsibilities = [
  {
    icon: Workflow,
    title: "Ce qu’ORÉE organise",
    description: "Le diagnostic, la collecte structurée, la complétude du dossier, les demandes et la prochaine action dans un espace unique.",
  },
  {
    icon: Building2,
    title: "Ce que traitent les organismes",
    description: "Les formalités officielles, contrôles et décisions restent effectués par les administrations et interlocuteurs compétents.",
  },
  {
    icon: Scale,
    title: "Ce qui exige un professionnel habilité",
    description: "Le conseil juridique, fiscal ou comptable personnalisé et les actes réglementés sont confirmés par le professionnel compétent lorsque nécessaire.",
  },
];

export function ServiceScope({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="max-w-4xl">
        <Badge>Périmètre et responsabilités</Badge>
        <h2 className={`${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-6xl"} mt-5 text-balance font-semibold leading-[1.02] tracking-[-.05em]`}>Savoir qui fait quoi, avant d’engager la démarche.</h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">La plateforme facilite le parcours sans se substituer à l’administration ni présenter une orientation automatique comme un conseil définitif.</p>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {responsibilities.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={index * .05}>
              <article className="h-full rounded-[20px] border border-[var(--line)] bg-white/72 p-6">
                <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--mint-soft)]"><Icon className="size-4.5" /></span><span className="text-3xl font-semibold text-[color:var(--ink)]/[.08]">0{index + 1}</span></div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-.03em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{item.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
