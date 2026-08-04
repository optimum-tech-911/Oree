import { Check, MessageCircle, PhoneCall, RotateCcw } from "lucide-react";
import {
  buildPhoneHref,
  buildWhatsAppHref,
  commercialOffers,
} from "@/config/commercial-offers";
import { analytics } from "@/services/analytics";

const includedRows = [
  "Accompagnement à la création",
  "Annonce légale",
  "Frais de greffe",
  "Corrections du dossier",
] as const;

export function SasuOfferReceipt() {
  const offer = commercialOffers.companyCreation;

  return (
    <section
      data-sasu-price-summary
      aria-labelledby="sasu-price-title"
      className="grid overflow-hidden border-y border-[var(--line-strong)] bg-white lg:grid-cols-[.72fr_1.28fr]"
    >
      <div className="bg-[var(--ink)] px-6 py-9 text-white sm:px-9 sm:py-11 lg:px-12">
        <p className="text-sm font-semibold text-[color:var(--mint)]">Création de votre SASU</p>
        <h2 id="sasu-price-title" className="mt-4 text-5xl font-semibold leading-none tracking-[-.055em] sm:text-6xl">
          {offer.totalLabel}
        </h2>
        <p className="mt-3 text-xl font-semibold">tout compris</p>
        <p className="mt-6 max-w-sm text-sm leading-7 text-white/72">
          Les quatre postes ci-contre sont compris dans le prix annoncé.
        </p>
      </div>

      <div className="px-6 py-7 sm:px-9 sm:py-9 lg:px-12">
        <p className="text-sm font-semibold">Ce qui est compris</p>
        <dl className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {includedRows.map((label) => (
            <div key={label} className="flex items-center justify-between gap-5 py-3.5 text-sm sm:py-4">
              <dt>{label}</dt>
              <dd className="flex shrink-0 items-center gap-2 font-semibold text-[color:var(--ink)]">
                <Check className="size-4 text-[color:var(--success)]" aria-hidden="true" />Compris
              </dd>
            </div>
          ))}
          <div className="flex items-end justify-between gap-5 py-5">
            <dt className="font-semibold">Total</dt>
            <dd className="text-2xl font-semibold tracking-[-.035em]">{offer.totalLabel}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-6 text-[color:var(--muted)]">{offer.restriction}</p>
      </div>
    </section>
  );
}

export function SasuHumanContact() {
  const contact = commercialOffers.contact;
  const whatsappMessage = "Bonjour, je souhaite créer une SASU avec Orée Entreprises.";

  return (
    <section aria-labelledby="sasu-contact-title" className="border-l-4 border-[var(--blue)] py-2 pl-5 sm:pl-7">
      <p className="text-sm font-semibold text-[color:var(--blue)]">Un échange avec l’équipe Orée</p>
      <h2 id="sasu-contact-title" className="mt-3 max-w-xl text-balance text-3xl font-semibold leading-[1.05] tracking-[-.045em] sm:text-4xl">
        Une question sur votre SASU&nbsp;? Parlons-en directement.
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
        Appelez-nous pour vérifier un point avant de commencer, ou demandez un rappel en laissant le contexte utile à l’équipe.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={buildPhoneHref()}
          data-phone-number={contact.displayPhone}
          onClick={() => analytics.track("phone_click", { legal_form: "SASU", location: "sasu_human_contact" })}
          className="button-on-action inline-flex min-h-14 items-center justify-center gap-3 rounded-[14px] bg-[var(--blue)] px-6 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(36,87,255,.2)] transition hover:-translate-y-0.5 hover:brightness-95"
        >
          <PhoneCall className="size-4" aria-hidden="true" />
          <span>Appeler <span className="ml-1 whitespace-nowrap">{contact.displayPhone}</span></span>
        </a>
        <a
          href="#rappel"
          onClick={() => analytics.track("primary_cta_clicked", { legal_form: "SASU", location: "sasu_human_contact", intent: "callback" })}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[14px] border border-[var(--line-strong)] bg-white px-6 text-sm font-semibold transition hover:border-[var(--blue)]/45"
        >
          <RotateCcw className="size-4" aria-hidden="true" />Être rappelé
        </a>
      </div>
      <a
        href={buildWhatsAppHref(undefined, whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        onClick={() => analytics.track("whatsapp_click", { legal_form: "SASU", location: "sasu_human_contact" })}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"
      >
        <MessageCircle className="size-4" aria-hidden="true" />Écrire sur WhatsApp
      </a>
    </section>
  );
}
