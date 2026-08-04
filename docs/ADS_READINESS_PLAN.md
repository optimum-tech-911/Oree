# Plan de préparation Google Ads

Mise à jour : 30 juillet 2026.

## Première campagne

```text
FR | Search | SASU | 14€/j | Août 2026
```

- réseau : Search uniquement ;
- zone : France ;
- langue : français ;
- landing page : `/creation-sasu/` ;
- intention principale : création de SASU avec accompagnement ;
- offre visible sans ambiguïté : `600 € TTC tout compris`.

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

Conversions principales configurées dans Google Ads :

- appels directs depuis les annonces ;
- appels depuis le site, qualifiés à partir d’environ 60 secondes de conversation.

Le clic sur un numéro reste un événement de diagnostic : il ne remplace jamais la
conversion d’appel qualifié mesurée par Google Ads.

Événements d’observation :

- `phone_click` ;
- `whatsapp_click` ;
- `callback_request` ;
- `diagnostic_start` ;
- `diagnostic_step` ;
- `diagnostic_complete` ;
- `pricing_viewed`.

Le formulaire de rappel et le diagnostic restent utiles pour piloter le parcours, sans
être confondus avec une conversation téléphonique qualifiée. La démonstration de
calendrier ne produit pas `appointment_booked`.

Le chargeur Google tag existant utilise `G-FL6QMMYVLM`. Le même chargeur reçoit la
configuration d’appel `AW-18362621917/mQHqCLOG6tscEN2__bNE` pour le numéro visible
`07 87 82 32 08`. Aucun second chargeur `gtag.js` ne doit être ajouté.

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
- [ ] initialisation GA4 et remplacement du numéro vérifiés avec Tag Assistant sur le domaine réel ;
- [ ] chaque conversion principale observée une seule fois ;
- [ ] qualification et gain vérifiés dans l’espace opérations ;
- [ ] import des conversions qualifiées documenté ;
- [ ] budget initial confirmé.

Le lancement reste bloqué tant que les éléments externes ci-dessus ne sont pas validés.
