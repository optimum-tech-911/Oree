# Analytics, attribution et Google Ads

## Objectif

Mesurer la qualité commerciale complète, pas seulement le formulaire.

## Attribution conservée

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `gclid`
- `gbraid`
- `wbraid`
- page d'entrée
- referrer
- première visite

Le frontend utilise `app/services/attribution.ts`.

## Événements

```text
landing_view
pricing_viewed
primary_cta_clicked
phone_click
whatsapp_click
callback_form_started
callback_requested
diagnostic_started
diagnostic_step_completed
diagnostic_completed
orientation_viewed
lead_form_started
lead_submitted
account_created
appointment_booked
project_created
document_uploaded
dossier_started
lead_contacted
lead_qualified
appointment_attended
proposal_accepted
customer_won
```

## Architecture

Les composants appellent une interface analytics, jamais directement `gtag`. Les adaptateurs futurs pourront écrire vers `dataLayer`, un journal interne et les conversions serveur.

## Données personnelles

Ne jamais envoyer à GA4 : nom, email, téléphone, texte libre du projet, nom de fichier, document, adresse précise ou message conseiller.

## Google Ads

Le premier lancement peut compter `lead_submitted`, `callback_requested` et une véritable
`appointment_booked`. La démonstration de calendrier n’est pas une conversion.

Les changements opérations `qualified` et `won` préparent respectivement
`qualify_lead` et `close_convert_lead`. Chaque événement serveur possède une clé
d’idempotence. Les conversions navigateur utilisent un `event_id` stable et ne sont
émises qu’une fois par session.
