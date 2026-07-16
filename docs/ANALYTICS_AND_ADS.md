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

Le premier lancement peut compter `lead_submitted` et `appointment_booked`, mais l'optimisation doit migrer vers `lead_qualified`, puis `customer_won`. Chaque événement serveur possède un identifiant d'idempotence.
