# Audit d’intégration de l’offre commerciale

Mise à jour : 30 juillet 2026.

## Résultat

Le dépôt V3 disposait déjà des fondations nécessaires : routes d’acquisition, diagnostic
adaptatif, attribution first-touch, consentement, soumission par Edge Function, RLS,
mode démonstration et espace opérations. L’intégration ne nécessite ni reconstruction ni
second backend.

L’écart principal était éditorial : `/tarifs` et plusieurs composants indiquaient encore
que le montant n’était pas validé. Les landing pages n’exposaient pas non plus les quatre
actions prévues pour le trafic payant, et le modèle opérations utilisait une nomenclature
commerciale antérieure.

## Audit par surface

| Surface | Avant l’intégration | Décision |
|---|---|---|
| Routes publiques | `/tarifs`, les quatre pages de forme, l’accompagnement et le diagnostic existaient | Conserver les routes et adapter le contenu |
| Prix | Textes provisoires sans montant | Source unique dans `app/config/commercial-offers.ts` |
| Pages SASU/EURL/SAS/SARL | Intention SEO correcte, offre absente | Titre spécifique + même forfait central |
| Contact | Téléphone, SMS, e-mail et WhatsApp déjà centralisés | Dériver les liens de la configuration commerciale et ajouter les quatre actions acquisition |
| Formulaire public | Diagnostic complet sécurisé | Le conserver et ajouter un formulaire de rappel court utilisant le même repository |
| Leads Supabase | Contacts, attribution normalisée, statut, score, affectation | Étendre par migration additive pour forme, activité, relance, motifs, notes et résultat |
| Sécurité lead | Edge Function, service role serveur, RLS, honeypot, rate limiting et idempotence | Conserver sans policy d’insert anonyme |
| Opérations | Qualification, score et affectation | Ajouter mot-clé, GCLID, landing, actions directes, notes, relance et résultats |
| Analytics | Service typé et consentement déjà présents | Ajouter les événements Ads manquants, filtrage PII et déduplication |
| Notifications | Outbox `notification_jobs` existante | Enrichir le payload et tenter l’envoi après persistance, sans faire échouer le lead |
| Consentement | Choix nécessaire/analytics/marketing versionné | Conserver tel quel |

## Mapping du modèle existant

Le schéma reste normalisé. Les noms demandés sont pris en charge ainsi :

| Besoin commercial | Autorité V3 |
|---|---|
| `preferred_contact_channel` | `leads.preferred_contact_method` |
| `landing_page`, `referrer`, UTM et click IDs | `lead_attributions`, avec `leads.source_page` pour la landing |
| `assigned_partner_id` | `leads.assigned_advisor_id`, relié aux rôles internes contrôlés |
| Notes | `lead_notes`, lecture RLS et écriture via RPC |
| Événements qualifié/gagné | `lead_lifecycle_events`, clé d’idempotence unique |

Ce mapping évite deux autorités concurrentes pour l’attribution et l’affectation.

## Points de sécurité confirmés

- aucune clé `service_role` n’est utilisée par le navigateur ;
- le public appelle uniquement `submit-lead` ;
- `submit_lead_bundle` reste exécutable uniquement par `service_role` ;
- les notes et événements lifecycle ont RLS activée et aucun droit d’écriture navigateur ;
- l’envoi d’e-mail intervient après la transaction de création du lead ;
- les événements analytics ne reçoivent ni nom, ni e-mail, ni téléphone, ni message libre ;
- le mode démonstration ne transmet aucune donnée personnelle.

## Configuration restant externe

- `APP_PUBLIC_URL` ;
- `LEAD_NOTIFICATION_EMAIL` ;
- `RESEND_API_KEY` et `RESEND_FROM_EMAIL`, si Resend est retenu ;
- identifiant réel du partenaire affecté ;
- vérification Tag Assistant sur le domaine de production ;
- budget publicitaire initial et activation manuelle de la campagne.
