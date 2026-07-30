# Plan de préparation Google Ads

Mise à jour : 30 juillet 2026.

## Première campagne

```text
FR | Search | Création SASU | Leads
```

- réseau : Search uniquement ;
- zone : France ;
- langue : français ;
- landing page : `/creation-sasu/` ;
- intention principale : création de SASU avec accompagnement ;
- offre visible sans ambiguïté : `600 € tout compris`.

## Groupes d’annonces initiaux

1. Création SASU
2. Prix création SASU
3. Accompagnement SASU

## Mots-clés de départ

```text
[création sasu]
[créer une sasu]
[prix création sasu]
[coût création sasu]
[accompagnement création sasu]
"création sasu en ligne"
"formalités création sasu"
"aide pour créer une sasu"
```

Thèmes négatifs initiaux :

```text
gratuit
modification
radiation
fermeture
emploi
stage
formation
cours
pdf
modèle gratuit
définition
association
```

Les termes de recherche réels doivent être examinés après lancement avant d’élargir cette
liste.

## Conversions

Conversions candidates principales :

- `lead_submitted` pour le diagnostic transmis ;
- `callback_requested` pour le formulaire de rappel court ;
- `appointment_booked` uniquement quand un calendrier réel confirme la réservation.

Événements d’observation :

- `phone_click` ;
- `whatsapp_click` ;
- `diagnostic_started` ;
- `diagnostic_completed` ;
- `pricing_viewed`.

Un clic téléphone ou WhatsApp n’est jamais assimilé à une conversation. La démonstration
de calendrier ne produit pas `appointment_booked`.

Les changements `qualified` et `won` créent respectivement des événements serveur
`qualify_lead` et `close_convert_lead`. Ils sont prêts pour un futur export Google Ads,
après définition de la convention d’import et des identifiants de conversion.

## Déduplication

- les soumissions publiques utilisent un UUID d’intake unique ;
- la base possède un index unique sur cet UUID ;
- les conversions navigateur utilisent `event_id` et `sessionStorage` ;
- les événements lifecycle utilisent une `event_key` unique en base.

## URL de recette Ads

Exemple sans donnée personnelle :

```text
/creation-sasu/?utm_source=google&utm_medium=cpc&utm_campaign=fr_search_creation_sasu_leads&utm_term=prix_creation_sasu&utm_content=annonce_a&gclid=TEST-GCLID
```

Après soumission, vérifier dans `/ops/leads` :

- landing `/creation-sasu/` ;
- campagne et mot-clé ;
- GCLID ;
- forme SASU ;
- calendrier ;
- canal de contact.

## Checklist avant dépense

- [ ] migration `0013_offer_and_ads_lead_workflow.sql` appliquée ;
- [ ] fonction `submit-lead` redéployée ;
- [ ] origine de production autorisée ;
- [ ] notification réellement reçue par le partenaire ;
- [ ] lien sécurisé de la notification ouvrable après authentification ;
- [ ] téléphone et WhatsApp testés sur mobile réel ;
- [ ] consentement analytics vérifié dans GTM Preview ;
- [ ] chaque conversion principale observée une seule fois ;
- [ ] qualification et gain vérifiés dans l’espace opérations ;
- [ ] import des conversions qualifiées documenté ;
- [ ] budget initial confirmé.

Le lancement reste bloqué tant que les éléments externes ci-dessus ne sont pas validés.
