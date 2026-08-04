# Rapport final — offre et préparation Ads

Mise à jour : 4 août 2026.

## Offre intégrée

La plateforme consomme maintenant `app/config/commercial-offers.ts` pour :

- le forfait société de `600 € TTC tout compris` ;
- SASU, EURL, SAS et SARL ;
- les inclusions, exclusions et le moment du paiement ;
- l’offre micro-entreprise à `100 €`, présentée en second plan ;
- le téléphone, WhatsApp, l’e-mail, la disponibilité et le partenaire à affecter ;
- un libellé fiscal configurable mais masqué.

Les pages d’accueil, tarifs, accompagnement, diagnostic et les quatre landing pages de
forme utilisent cette configuration. Les anciennes mentions de prix non validé ont été
retirées.

## Acquisition et contact

La landing SASU suit désormais une hiérarchie dédiée à la conversion par appel :

- `Appeler maintenant` et le `07 87 82 32 08` sont l’action principale ;
- `Être rappelé` reste la deuxième action et réutilise le flux Supabase existant ;
- `Commencer mon dossier` conserve l’entrée dans le diagnostic ;
- WhatsApp reste accessible comme canal secondaire ;
- la barre mobile SASU donne un accès persistant au lien `tel:+33787823208`.

Les autres landings conservent leur parcours d’acquisition existant.

Le formulaire de rappel est mobile-first, validé par Zod et React Hook Form, protégé par
le honeypot existant et soumis par le même repository/Edge Function que le diagnostic.
En mode démonstration, aucune donnée personnelle ne quitte le navigateur.

## Leads et opérations

La migration `0013_offer_and_ads_lead_workflow.sql` ajoute :

- forme juridique, activité, calendrier et message ;
- dernier contact, prochaine relance, motif de qualification, motif de perte et date de gain ;
- notes internes avec RLS ;
- dix statuts commerciaux confirmés ;
- transitions contrôlées et auditées ;
- événements lifecycle qualifié/gagné dédupliqués.

La file opérations affiche les coordonnées, le projet, la landing, la campagne, le
mot-clé, le GCLID, les relances, notes et résultats. Elle propose les liens appel,
WhatsApp et e-mail, ainsi que les actions qualifié, gagné, perdu et hors cible.

## Analytics, attribution et appels Google Ads

Le chargeur Google existant est réutilisé : il n’existe qu’un seul chargement de
`gtag.js`, une seule configuration GA4 `G-FL6QMMYVLM` et une seule configuration appel
Ads `AW-18362621917/mQHqCLOG6tscEN2__bNE` avec le numéro
`07 87 82 32 08`. Le prérendu bloque les requêtes Google pendant la génération afin de
ne jamais sérialiser les scripts WCM injectés dynamiquement dans le HTML statique.

Les événements publics sont typés et envoyés via l’abstraction analytics existante
après consentement. `phone_click` et `whatsapp_click` restent des événements de
diagnostic ; l’appel qualifié mesuré par l’action Google Ads demeure la conversion
principale. Les paramètres GCLID, UTM, GBRAID et WBRAID restent conservés dès l’entrée.
Un filtre supprime les clés de données personnelles des paramètres analytics.

Le lead est persisté avant toute tentative de notification. L’outbox existante reçoit
un résumé, la source d’acquisition et le chemin sécurisé. Lorsque les variables Resend
et l’URL publique sont configurées, l’Edge Function tente l’envoi puis marque le job
`sent` ou `failed`. Un échec d’e-mail ne transforme jamais une création de lead réussie
en erreur publique.

## Révision visuelle

- héros SASU plus compact, prix et périmètre visibles avant tout écran produit ;
- reçu éditorial avec les quatre inclusions exactes et total TTC ;
- retrait du faux mini-dashboard de la landing SASU ;
- sections de contenu passées de grilles de cartes répétitives à des compositions avec
  séparateurs, respiration et hiérarchie éditoriale ;
- bloc de contact humain sans faux nom, faux portrait, faux horaires ou témoignage ;
- diagnostic ramené à une progression unique, une question principale et une synthèse
  sobre ;
- correction du contraste réel des liens et boutons sombres/bleus dans la cascade CSS ;
- premier rendu du héros prérendu sans élément critique masqué par une animation.

## Vérifications

Vérifications réalisées le 4 août 2026 :

- `npm ci` : réussi, installation propre depuis le lockfile ;
- ESLint : réussi ;
- TypeScript strict : réussi ;
- Vitest : 48 tests réussis sur 48 ;
- build Vite et prérendu : réussis sur 47 routes ;
- index Guide Orée : 1 988 entrées issues de 97 fichiers, avec réponses commerciales
  contrôlées ;
- Playwright complet : 175 tests réussis, 11 scénarios connectés
  explicitement ignorés faute de sessions client et opérations réelles ;
- crawlabilité : 19 routes publiques contrôlées avec 6 user-agents.

Les contrôles Playwright couvrent la landing SASU à 375, 390, 430, 768 et 1 440 px,
le formulaire de rappel, le diagnostic simplifié, le lien téléphonique, l’absence de
débordement, le contraste, la conservation des paramètres d’attribution et l’unicité
des configurations Google.

La suite Playwright complète tient compte des redirections d’authentification lorsque
Supabase est configuré. Elle ne présente aucun échec sur les routes publiques, les
landings d’acquisition, le responsive, le contraste ou le prérendu.

Le runtime du navigateur intégré n’était pas disponible pendant cette passe. Aucune
revue visuelle interactive supplémentaire n’est donc revendiquée ; la validation
automatisée multi-navigateur reste documentée ci-dessus.

## Restant configurable ou externe

- déployer cette version sur le domaine de production ;
- vérifier dans Tag Assistant, sur le domaine réel, le chargement unique de GA4 et de
  l’action d’appel Ads, puis tester le remplacement/acheminement du numéro sur un vrai
  appareil sans déclencher de fausse conversion ;
- confirmer dans Google Ads la durée minimale d’appel qualifié et le statut de
  conversion principale avant activation de la campagne ;
- appliquer la migration `0013_offer_and_ads_lead_workflow.sql` et redéployer
  `submit-lead` si ce n’est pas encore fait sur le projet Supabase distant ;
- confirmer l’identité juridique, l’adresse d’envoi, le domaine public et le partenaire
  réellement affecté.
