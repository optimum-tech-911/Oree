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

Les composants appellent l’interface analytics, jamais directement `gtag`. Après accord
analytics, cette interface réutilise le Google tag existant pour émettre les événements
GA4. `landing_view` reste un événement distinct et ne crée pas un second `page_view`.

Noms GA4 émis pour le parcours publicitaire :

```text
phone_click
whatsapp_click
callback_request
diagnostic_start
diagnostic_step
diagnostic_complete
```

## Données personnelles

Ne jamais envoyer à GA4 : nom, email, téléphone, texte libre du projet, nom de fichier, document, adresse précise ou message conseiller.

## Google Ads

Le Google tag existant charge la destination GA4 `G-FL6QMMYVLM`. La configuration
`AW-18362621917/mQHqCLOG6tscEN2__bNE` active le remplacement du numéro
`07 87 82 32 08` pour les appels depuis le site. Il n’existe qu’un seul chargeur
`gtag.js`.

Les conversions principales du premier lancement sont les appels directs depuis les
annonces et les appels depuis le site qualifiés par leur durée. `phone_click` reste un
événement de diagnostic, jamais une conversation qualifiée.

`callback_request`, `lead_submitted` et une véritable `appointment_booked` peuvent être
analysés séparément. La démonstration de calendrier n’est pas une conversion.

Les changements opérations `qualified` et `won` préparent respectivement
`qualify_lead` et `close_convert_lead`. Chaque événement serveur possède une clé
d’idempotence. Les conversions navigateur utilisent un `event_id` stable et ne sont
émises qu’une fois par session.
