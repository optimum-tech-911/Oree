import type { LegalFormCode } from "@/types";

export type SupportedCompanyForm = Extract<LegalFormCode, "SASU" | "EURL" | "SAS" | "SARL">;

export type CommercialOffer = {
  id: "company_creation" | "micro_enterprise";
  active: boolean;
  title: string;
  price: number;
  priceLabel: string;
  description: string;
  included: readonly string[];
  ctaLabel: string;
  paymentStage: string;
  tax: {
    configured: boolean;
    publicLabel: string | null;
    visible: boolean;
  };
};

const companyForms = ["SASU", "EURL", "SAS", "SARL"] as const satisfies readonly SupportedCompanyForm[];

export const commercialOffers = {
  companyCreation: {
    id: "company_creation",
    active: true,
    title: "Création de votre société",
    price: 600,
    totalLabel: "600 € TTC",
    priceLabel: "600 € TTC tout compris",
    description: "Un prix fixe pour préparer et déposer votre dossier de création.",
    enabledForms: companyForms,
    otherFormsWording: "Les autres formes de société peuvent être étudiées après vérification du projet.",
    included: [
      "Accompagnement à la création",
      "Frais de greffe inclus",
      "Annonce légale incluse",
      "Corrections et compléments du dossier inclus",
    ],
    excludedServices: ["Modification d’une société existante"],
    restriction: "Offre réservée aux créations d’entreprise. Les modifications de sociétés existantes ne sont pas prises en charge.",
    ctaLabel: "Commencer ma création",
    callbackCtaLabel: "Être rappelé",
    paymentStage: "Le paiement intervient après que vous avez renseigné les informations nécessaires au dossier.",
    tax: {
      configured: true,
      publicLabel: null,
      visible: false,
    },
  },
  microEnterprise: {
    id: "micro_enterprise",
    active: true,
    title: "Création de micro-entreprise",
    price: 100,
    priceLabel: "100 €",
    description: "Nous réalisons la démarche de création pour votre compte.",
    included: ["Réalisation de la démarche de création"],
    ctaLabel: "Créer ma micro-entreprise",
    paymentStage: "Les modalités de paiement sont confirmées avant le démarrage de la démarche.",
    tax: {
      configured: false,
      publicLabel: null,
      visible: false,
    },
  },
  contact: {
    phone: "+33787823208",
    displayPhone: "07 87 82 32 08",
    whatsapp: "+33787823208",
    email: "sebaasofiene@gmail.com",
    availability: "Disponibilités à confirmer lors de la prise de contact",
    assignedPartner: {
      id: null,
      label: "Partenaire Orée à affecter",
    },
  },
} as const;

export function isSupportedCompanyForm(value: string | undefined): value is SupportedCompanyForm {
  return Boolean(value && commercialOffers.companyCreation.enabledForms.includes(value as SupportedCompanyForm));
}

export function companyOfferHeadline(form: SupportedCompanyForm) {
  return `Créez votre ${form} pour ${commercialOffers.companyCreation.priceLabel}`;
}

export function normalizePhoneForLink(value: string) {
  const compact = value.replace(/[^\d+]/g, "");
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (compact.startsWith("0")) return `+33${compact.slice(1)}`;
  return `+${compact}`;
}

export function buildPhoneHref(value: string = commercialOffers.contact.phone) {
  return `tel:${normalizePhoneForLink(value)}`;
}

export function buildWhatsAppHref(
  value: string = commercialOffers.contact.whatsapp,
  message: string = "Bonjour, je souhaite échanger au sujet de la création de mon entreprise.",
) {
  return `https://wa.me/${normalizePhoneForLink(value).slice(1)}?text=${encodeURIComponent(message)}`;
}

export function buildEmailHref(
  email: string = commercialOffers.contact.email,
  subject: string = "Demande depuis Orée Entreprises",
  body: string = "Bonjour, je souhaite échanger au sujet de la création de mon entreprise.",
) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
