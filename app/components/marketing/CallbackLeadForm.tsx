import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, LoaderCircle, PhoneCall } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { buildPhoneHref, commercialOffers, type SupportedCompanyForm } from "@/config/commercial-offers";
import { leadRepository } from "@/services/supabase/repositories";
import { analytics } from "@/services/analytics";
import type { DiagnosticAnswers, DiagnosticRecommendation } from "@/types";

const callbackSchema = z.object({
  firstName: z.string().trim().min(2, "Indiquez votre prénom.").max(80),
  lastName: z.string().trim().min(2, "Indiquez votre nom.").max(100),
  email: z.string().trim().email("Indiquez une adresse e-mail valide.").max(254),
  phone: z.string().trim().regex(/^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/, "Indiquez un numéro de téléphone français valide."),
  activity: z.string().trim().min(3, "Décrivez brièvement votre activité.").max(100),
  creationTimeline: z.enum(["under-30", "30-90", "over-90", "unknown"]),
  privacyAccepted: z.boolean().refine((value) => value, "Votre accord est nécessaire pour traiter la demande."),
  website: z.string().max(200).optional(),
});

type CallbackFormValues = z.infer<typeof callbackSchema>;

const timelineLabels: Record<CallbackFormValues["creationTimeline"], string> = {
  "under-30": "Dans moins de 30 jours",
  "30-90": "Dans 1 à 3 mois",
  "over-90": "Dans plus de 3 mois",
  unknown: "Calendrier à préciser",
};

function callbackRecommendation(legalForm?: SupportedCompanyForm): DiagnosticRecommendation {
  const forms: DiagnosticRecommendation["forms"] = legalForm ? [legalForm] : ["SASU", "EURL"];
  return {
    forms,
    title: legalForm ? `Projet de ${legalForm} à reprendre avec l’équipe` : "Projet de société à qualifier",
    explanation: "La demande de rappel recueille uniquement les premières informations utiles. L’orientation reste à confirmer à partir du projet complet.",
    reasons: ["Une demande de rappel a été formulée."],
    pointsToValidate: ["Forme juridique", "Activité", "Calendrier de création"],
    action: { label: "Être rappelé", href: "#rappel" },
    complexity: "modéré",
  };
}

export function CallbackLeadForm({ legalForm, slug }: { legalForm?: SupportedCompanyForm; slug: string }) {
  const [submitted, setSubmitted] = useState<"live" | "demo" | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const started = useRef(false);
  const [submissionId] = useState(() => globalThis.crypto.randomUUID());
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CallbackFormValues>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      creationTimeline: "30-90",
      privacyAccepted: false,
      website: "",
    },
  });

  function trackStart() {
    if (started.current) return;
    started.current = true;
    analytics.track("callback_form_started", { path: `/${slug}`, legal_form: legalForm });
  }

  async function submit(values: CallbackFormValues) {
    setServerError(null);
    try {
      const multiple = legalForm === "SAS" || legalForm === "SARL";
      const answers: DiagnosticAnswers = {
        startingSituation: multiple ? "multiple" : "solo",
        stage: multiple ? "multi-founder" : "ready-to-create",
        founderMode: multiple ? "multiple" : "solo",
        activity: values.activity,
        activityDetails: values.activity,
        timeline: values.creationTimeline,
        creationTimeline: values.creationTimeline,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        preferredContactChannel: "phone",
        legalFormInterest: legalForm,
        privacyAccepted: values.privacyAccepted,
        wantsCallback: true,
      };
      const result = await leadRepository.submit(answers, {
        result: callbackRecommendation(legalForm),
        submissionId,
        anonymousSessionId: submissionId,
        honeypot: values.website,
      });
      analytics.trackOnce("callback_requested", result.id, {
        path: `/${slug}`,
        legal_form: legalForm,
        timeline: values.creationTimeline,
      });
      setSubmitted(result.demo ? "demo" : "live");
    } catch (cause) {
      if (import.meta.env.DEV) console.error("callback-request", cause);
      setServerError("Nous n’avons pas pu enregistrer votre demande. Réessayez dans un instant ou appelez-nous directement.");
    }
  }

  if (submitted) {
    return (
      <div id="rappel" data-callback-form aria-live="polite" className="grid min-h-[360px] scroll-mt-28 place-items-center rounded-[18px] bg-[var(--ink)] p-7 text-center text-white sm:p-10">
        <div>
          <span className="mx-auto grid size-13 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Check className="size-6" /></span>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-.045em]">Votre demande de rappel est enregistrée.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/72">
            {submitted === "demo"
              ? "Mode démonstration : aucune donnée personnelle n’a quitté votre navigateur."
              : "L’équipe dispose des informations transmises pour reprendre votre demande avec vous."}
          </p>
        </div>
      </div>
    );
  }

  const fieldClass = "mt-2 h-12 w-full rounded-[12px] border border-[var(--line-strong)] bg-white px-4 font-normal outline-none transition focus:border-[var(--blue)]/55 focus:ring-4 focus:ring-[var(--blue)]/8";

  return (
    <form id="rappel" data-callback-form onFocusCapture={trackStart} onSubmit={handleSubmit(submit)} className="scroll-mt-28 rounded-[18px] border border-[var(--line-strong)] bg-[var(--paper)] p-5 sm:p-7 lg:p-8">
      <div className="flex items-start gap-3 border-b border-[var(--line)] pb-6">
        <PhoneCall className="mt-1 size-5 shrink-0 text-[color:var(--blue)]" />
        <div>
          <p className="text-sm font-semibold text-[color:var(--blue)]">{commercialOffers.companyCreation.callbackCtaLabel}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Demandez à l’équipe de vous rappeler.</h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">Indiquez les coordonnées et le contexte nécessaires pour reprendre votre projet. Vous préférez appeler&nbsp;? <a href={buildPhoneHref()} data-phone-number={commercialOffers.contact.displayPhone} onClick={() => analytics.track("phone_click", { legal_form: legalForm, location: "callback_form" })} className="font-semibold text-[color:var(--blue)]">{commercialOffers.contact.displayPhone}</a>.</p>
        </div>
      </div>
      <label aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">Votre site internet<input type="url" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Prénom<input autoComplete="given-name" className={fieldClass} {...register("firstName")} />{errors.firstName ? <span className="mt-1 block text-xs text-[color:var(--blue)]">{errors.firstName.message}</span> : null}</label>
        <label className="text-sm font-semibold">Nom<input autoComplete="family-name" className={fieldClass} {...register("lastName")} />{errors.lastName ? <span className="mt-1 block text-xs text-[color:var(--blue)]">{errors.lastName.message}</span> : null}</label>
        <label className="text-sm font-semibold">E-mail<input type="email" autoComplete="email" className={fieldClass} {...register("email")} />{errors.email ? <span className="mt-1 block text-xs text-[color:var(--blue)]">{errors.email.message}</span> : null}</label>
        <label className="text-sm font-semibold">Téléphone<input type="tel" autoComplete="tel" placeholder="06 00 00 00 00" className={fieldClass} {...register("phone")} />{errors.phone ? <span className="mt-1 block text-xs text-[color:var(--blue)]">{errors.phone.message}</span> : null}</label>
        <label className="text-sm font-semibold sm:col-span-2">Activité<input placeholder="Ex. conseil en stratégie" className={fieldClass} {...register("activity")} />{errors.activity ? <span className="mt-1 block text-xs text-[color:var(--blue)]">{errors.activity.message}</span> : null}</label>
        <label className="text-sm font-semibold sm:col-span-2">Date de création souhaitée<select className={fieldClass} {...register("creationTimeline")}>{Object.entries(timelineLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-[var(--line)] pt-5 text-xs leading-5">
        <input type="checkbox" className="mt-0.5 size-5 accent-[var(--blue)]" {...register("privacyAccepted")} />
        <span>J’accepte le traitement de mes données pour répondre à cette demande de rappel.</span>
      </label>
      {errors.privacyAccepted ? <p className="mt-2 text-xs text-[color:var(--blue)]">{errors.privacyAccepted.message}</p> : null}
      {serverError ? <p role="alert" className="mt-4 rounded-[16px] bg-[var(--blue)]/8 p-3 text-sm text-[color:var(--blue)]">{serverError}</p> : null}
      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="mt-5 w-full">
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <PhoneCall className="size-4" />}
        {isSubmitting ? "Transmission…" : commercialOffers.companyCreation.callbackCtaLabel}
      </Button>
    </form>
  );
}
