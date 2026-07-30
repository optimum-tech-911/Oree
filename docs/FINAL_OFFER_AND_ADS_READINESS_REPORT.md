# Rapport final — offre et préparation Ads

Mise à jour : 30 juillet 2026.

## Offre intégrée

La plateforme consomme maintenant `app/config/commercial-offers.ts` pour :

- le forfait société de `600 € tout compris` ;
- SASU, EURL, SAS et SARL ;
- les inclusions, exclusions et le moment du paiement ;
- l’offre micro-entreprise à `100 €`, présentée en second plan ;
- le téléphone, WhatsApp, l’e-mail, la disponibilité et le partenaire à affecter ;
- un libellé fiscal configurable mais masqué.

Les pages d’accueil, tarifs, accompagnement, diagnostic et les quatre landing pages de
forme utilisent cette configuration. Les anciennes mentions de prix non validé ont été
retirées.

## Acquisition et contact

Chaque landing d’acquisition propose :

- Commencer ma création ;
- Être rappelé ;
- Appeler ;
- Écrire sur WhatsApp.

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

## Analytics et notifications

Les événements publics sont typés. Les conversions utilisent un identifiant stable et
ne sont émises qu’une fois par session. Un filtre supprime les clés de données
personnelles des paramètres analytics.

Le lead est persisté avant toute tentative de notification. L’outbox existante reçoit
un résumé, la source d’acquisition et le chemin sécurisé. Lorsque les variables Resend
et l’URL publique sont configurées, l’Edge Function tente l’envoi puis marque le job
`sent` ou `failed`. Un échec d’e-mail ne transforme jamais une création de lead réussie
en erreur publique.

## Vérifications

Vérifications réalisées le 30 juillet 2026 :

- `npm ci` : réussi, installation propre depuis le lockfile ;
- ESLint : réussi ;
- TypeScript strict : réussi ;
- Vitest : 47 tests réussis sur 47 ;
- build Vite et prérendu : réussis sur 47 routes ;
- index Guide Orée : 1 931 entrées issues de 96 fichiers, avec réponses commerciales
  contrôlées ;
- Playwright ciblé offre et formulaire mobile : 12 tests réussis sur 12 dans Chromium
  et Mobile Safari ;
- Playwright ciblé Guide Orée et compositions mobiles : 7 scénarios réussis dans
  Chromium ;
- Playwright complet : 159 tests réussis, 11 scénarios de démonstration connectés
  explicitement ignorés faute de sessions client et opérations réelles ;
- crawlabilité : 19 routes publiques contrôlées avec 6 user-agents.

La suite Playwright complète tient compte des redirections d’authentification lorsque
Supabase est configuré. Elle ne présente aucun échec sur les routes publiques, les
landings d’acquisition, le responsive, le contraste ou le prérendu.

Le runtime du navigateur intégré n’était pas disponible pendant cette passe. Aucune
revue visuelle interactive supplémentaire n’est donc revendiquée ; la validation
automatisée multi-navigateur reste documentée ci-dessus.

## Restant configurable ou externe

- libellé et régime fiscal ;
- partenaire réellement affecté ;
- disponibilité publique ;
- fournisseur et adresse d’envoi ;
- URL de production ;
- GTM, GA4, Google Ads et IDs de conversion ;
- convention d’export des événements lifecycle ;
- budget Ads ;
- application de la migration et déploiement Edge sur le projet distant.
