import {
  buildEmailHref,
  buildPhoneHref,
  buildWhatsAppHref,
  commercialOffers,
} from "@/config/commercial-offers";

export const directContact = commercialOffers.contact;

const message = "Bonjour, j’ai une question au sujet de la création de mon entreprise.";

export const directContactOptions = [
  { id: "call", label: "Appeler", description: "Parler directement à l’équipe.", href: buildPhoneHref(), external: false },
  { id: "sms", label: "Envoyer un SMS", description: "Poser une question en quelques mots.", href: `sms:${directContact.phone}?body=${encodeURIComponent(message)}`, external: false },
  { id: "email", label: "Écrire par e-mail", description: "Envoyer une demande plus détaillée.", href: buildEmailHref(directContact.email, "Demande depuis Orée Entreprises", message), external: false },
  { id: "whatsapp", label: "WhatsApp", description: "Continuer la conversation dans WhatsApp.", href: buildWhatsAppHref(directContact.whatsapp, message), external: true },
  { id: "whatsapp-business", label: "WhatsApp Business", description: "Ouvrir l’échange côté professionnel.", href: `https://api.whatsapp.com/send?phone=${directContact.phone.slice(1)}&text=${encodeURIComponent(message)}`, external: true },
] as const;

export type DirectContactOption = (typeof directContactOptions)[number];

export function openDirectContact() {
  window.dispatchEvent(new CustomEvent("oree:contact-open"));
}
