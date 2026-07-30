import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check, FileCheck2, ReceiptText, Scale, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CostClarity } from "@/components/marketing/CostClarity";
import { Faq } from "@/components/marketing/Faq";
import { Reveal } from "@/components/marketing/Reveal";
import { CompanyOfferCard, MicroEnterpriseOfferCard } from "@/components/marketing/CommercialOfferCard";
import { commercialOffers } from "@/config/commercial-offers";
import { usePageMeta } from "@/hooks/usePageMeta";
import { analytics } from "@/services/analytics";

const quoteChecks = [
  {
    icon: FileCheck2,
    title: `Inclus dans les ${commercialOffers.companyCreation.priceLabel}`,
    items: commercialOffers.companyCreation.included,
  },
  {
    icon: Scale,
    title: "Périmètre de l’offre",
    items: [
      "Création de SASU, EURL, SAS ou SARL",
      commercialOffers.companyCreation.otherFormsWording,
      commercialOffers.companyCreation.restriction,
    ],
  },
  {
    icon: ShieldCheck,
    title: "Avant de payer",
    items: [
      commercialOffers.companyCreation.paymentStage,
      "Le projet et les informations nécessaires sont d’abord renseignés.",
      "Toute prestation qui sortirait du périmètre doit être présentée et acceptée séparément.",
    ],
  },
];

export default function OffersPage() {
  const { pathname } = useLocation();
  const offer = commercialOffers.companyCreation;
  usePageMeta("Tarifs de création d’entreprise", `${offer.priceLabel} pour créer une SASU, EURL, SAS ou SARL, avec greffe, annonce légale et corrections incluses.`, { canonicalPath: "/tarifs" });

  useEffect(() => {
    analytics.track("landing_view", { path: pathname, pageType: "pricing" });
  }, [pathname]);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-34 sm:pb-22 sm:pt-42 lg:pb-24">
        <div className="absolute inset-0 grid-fade opacity-65" />
        <div className="container-shell relative grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <Badge><ReceiptText className="size-3.5" />Tarif confirmé</Badge>
            <h1 className="mt-6 max-w-5xl text-balance text-[clamp(2.8rem,6vw,6.5rem)] font-semibold leading-[.94] tracking-[-.06em]">
              Créez votre société pour <span className="editorial-mark text-[color:var(--blue)]">{offer.priceLabel}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[color:var(--muted)] sm:text-lg">{offer.description} Le même forfait s’applique aux formes principales prises en charge.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/diagnostic" onClick={() => analytics.track("primary_cta_clicked", { path: pathname, location: "pricing_hero", offer: offer.id })} size="lg" arrow>{offer.ctaLabel}</ButtonLink>
              <ButtonLink to="/accompagnement" variant="secondary" size="lg">Comprendre l’accompagnement</ButtonLink>
            </div>
          </div>
          <div className="rounded-[26px] border border-[var(--line)] bg-[var(--ink)] p-6 text-white shadow-[0_28px_90px_rgba(11,18,32,.18)] sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[color:var(--mint)]">SASU · EURL · SAS · SARL</p>
            <p className="mt-4 text-5xl font-semibold tracking-[-.06em] sm:text-6xl">{offer.priceLabel}</p>
            <p className="mt-4 text-sm leading-7 text-white/72">Accompagnement, frais de greffe, annonce légale et corrections ou compléments du dossier sont compris.</p>
            <ul className="mt-6 space-y-3">{offer.included.slice(0, 4).map((item) => <li key={item} className="flex gap-3 text-sm text-white/82"><Check className="mt-0.5 size-4 shrink-0 text-[color:var(--mint)]" />{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <Section className="bg-white/55 pt-14 sm:pt-18">
        <div className="container-shell grid items-start gap-5 xl:grid-cols-[1.38fr_.62fr]">
          <CompanyOfferCard trackingLocation="pricing_main" />
          <MicroEnterpriseOfferCard trackingLocation="pricing_secondary" />
        </div>
      </Section>

      <Section>
        <div className="container-shell">
          <div className="max-w-4xl"><Badge>Lecture de l’offre</Badge><h2 className="mt-6 text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Un prix unique, avec un périmètre explicite.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)]">La forme juridique principale ne déclenche pas de supplément. Les demandes qui ne relèvent pas d’une création de société sont qualifiées séparément.</p></div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">{quoteChecks.map((block, index) => { const Icon = block.icon; return <Reveal key={block.title} delay={index * .05}><article className="h-full rounded-[22px] border border-[var(--line)] bg-white p-6"><span className="grid size-11 place-items-center rounded-[14px] bg-[var(--ink)] text-white"><Icon className="size-4.5" /></span><h3 className="mt-6 text-xl font-semibold tracking-[-.03em]">{block.title}</h3><ul className="mt-5 space-y-3">{block.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]"><Check className="mt-1 size-3.5 shrink-0 text-[color:var(--success)]" />{item}</li>)}</ul></article></Reveal>; })}</div>
        </div>
      </Section>

      <Section className="bg-white/55">
        <div className="container-shell"><CostClarity /></div>
      </Section>

      <Section>
        <div className="container-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><Badge>Questions tarifaires</Badge><h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Les éléments à connaître avant de commencer.</h2></div>
          <Faq items={[
            { question: "Les frais de greffe et l’annonce légale sont-ils inclus ?", answer: `Oui. Le forfait de ${offer.priceLabel} comprend les frais de greffe et l’annonce légale nécessaires à la création prise en charge.` },
            { question: "Le prix change-t-il entre SASU, EURL, SAS et SARL ?", answer: "Non. Aucun supplément n’est appliqué selon l’une de ces quatre formes. Les autres projets de création peuvent être étudiés après vérification." },
            { question: "Quand le paiement intervient-il ?", answer: offer.paymentStage },
            { question: "Prenez-vous en charge les modifications de sociétés existantes ?", answer: "Non. L’offre est réservée aux créations d’entreprise et ne couvre pas les modifications d’une société existante." },
            { question: `Le prix de ${commercialOffers.microEnterprise.priceLabel} concerne-t-il une société ?`, answer: "Non. Il s’agit d’une offre distincte d’accompagnement à la création d’une micro-entreprise." },
          ]} />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-shell"><div className="rounded-[26px] bg-[var(--ink)] px-6 py-12 text-white sm:px-10 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-14"><div><Badge className="border-white/10 bg-white/[.06] text-white/72">Étape suivante</Badge><h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-5xl">Commencez par les informations utiles au dossier.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/72">{offer.paymentStage}</p></div><ButtonLink to="/diagnostic" onClick={() => analytics.track("primary_cta_clicked", { path: pathname, location: "pricing_final", offer: offer.id })} variant="dark" size="lg" className="mt-8 shrink-0 lg:mt-0" arrow>{offer.ctaLabel}</ButtonLink></div></div>
      </Section>
    </>
  );
}
