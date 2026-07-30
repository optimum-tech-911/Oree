# État d’implémentation — V3 canonique

Mise à jour : 30 juillet 2026.

## État de livraison

Le dépôt V3 est l’application canonique. Les apports utiles de V4 ont été intégrés
fonction par fonction ; V4 n’est ni une seconde application ni une cible de déploiement.

Le projet Supabase `sksydcdkliuisaahysya` (`oree`) est lié et actif. Les migrations `0001` à
`0012` sont appliquées, les fonctions `submit-lead`, `claim-lead` et `create-project`
sont actives, et le lint distant ne remonte aucune erreur de schéma.

La migration locale `0013_offer_and_ads_lead_workflow.sql` et l’évolution de
`submit-lead` sont prêtes dans le dépôt, mais ne sont pas encore appliquées au projet
distant.

## Offre commerciale et acquisition Ads

- source typée unique pour le forfait société à 600 € tout compris et la création de
  micro-entreprise à 100 € ;
- offre société active pour SASU, EURL, SAS et SARL, sans supplément selon la forme ;
- accueil, tarifs, accompagnement, diagnostic et landings de forme alignés ;
- quatre actions d’acquisition : démarrage, rappel, téléphone et WhatsApp ;
- formulaire de rappel court soumis par l’Edge Function sécurisée existante ;
- événements de conversion typés, dédupliqués et filtrés contre les données
  personnelles ;
- file leads enrichie pour l’attribution Ads, les relances, notes, motifs et résultats ;
- migration additive avec RLS pour les notes et événements lifecycle ;
- plan de première campagne Search SASU documenté dans `docs/ADS_READINESS_PLAN.md`.

## Parcours publics

- pages d’acquisition par intention, contenus SEO et sitemap cohérents ;
- diagnostic adaptatif, déterministe, versionné et explicable ;
- valeur fournie avant création de compte ;
- reprise sécurisée du lead après authentification ;
- téléphone facultatif sauf demande de rappel ;
- consentement, attribution UTM/GCLID/GBRAID/WBRAID et analytics conditionnels ;
- soumission sans captcha externe, protégée par honeypot invisible et rate limiting
  serveur haché ;
- Guide Orée local, vocal lorsque disponible, indexé depuis les contenus versionnés ;
- sitemap, robots et `llms.txt` générés depuis les routes canoniques et l’offre centrale ;
- mode démonstration complet lorsque Supabase n’est pas configuré.

## Espace client connecté

- centre de pilotage, projet et progression réels ;
- orientation issue du projet et du diagnostic lié ;
- fondateurs et répartition du capital enregistrés dans le dossier ;
- checklist documentaire, upload privé et téléchargement par URL signée courte ;
- formalités dérivées du stade, des pièces et des tâches réelles ;
- suivi chronologique ;
- messagerie projet avec état de lecture par utilisateur ;
- calendrier mensuel et demandes de rendez-vous ;
- notifications calculées depuis les données du dossier ;
- profil, disponibilités, préférences et demandes relatives aux données.

## Espace opérations connecté

- indicateurs, funnel, canaux d’acquisition et files prioritaires ;
- qualification et affectation des leads ;
- pilotage des projets et changements de stade contrôlés ;
- contrôle documentaire ;
- gestion des demandes de rendez-vous ;
- messagerie client et notes internes ;
- équipe et rôles administrés par RPC contrôlée ;
- journal d’audit des actions sensibles ;
- profil opérationnel réel, séparé du rôle interne.
- rafraîchissement de la file des demandes et du cockpit toutes les 15 secondes pour
  faire remonter les nouvelles demandes sans rechargement manuel ;

Toutes les lectures restent filtrées par RLS. Les changements opérationnels sensibles
passent par des fonctions SQL contrôlées qui vérifient l’utilisateur, le rôle et/ou
l’affectation. Un client ne peut pas se promouvoir, valider ses propres documents ou
modifier directement le stade opérationnel de son projet.

## Design et accessibilité

- palette limitée à l’encre, au blanc, au bleu électrique et à la menthe ;
- Onest et Newsreader uniquement ;
- interfaces mobile-first, navigation dédiée et barre de conversion sans chevauchement ;
- états vide, chargement, erreur et succès sur les parcours connectés ;
- mouvement utile avec prise en charge de `prefers-reduced-motion` ;
- imagerie centralisée dans `app/content/imagery.ts`, optimisée AVIF/WebP et sans faux
  document, faux écran produit, témoignage ou partenariat.
- Guide Orée présenté comme un outil sobre de recherche et de navigation, sans robot,
  étincelles, baguette magique, halo pulsant ou promesse d’intelligence artificielle.

## Vérifications du 22 juillet 2026

- ESLint : réussi ;
- TypeScript strict : réussi ;
- Vitest : 26 tests réussis sur 26 ;
- index Guide Orée : 1 685 entrées issues de 84 fichiers ;
- build Vite de production : réussi ;
- Supabase DB lint distant : aucune erreur ;
- historique distant : migrations `0001` à `0012` synchronisées ;
- trois Edge Functions : état `ACTIVE`.

La procédure d’intake `submit_lead_bundle` a aussi été exécutée dans une
transaction annulée sur le projet distant : l’écriture est valide et aucun lead
de test n’a été conservé. L’endpoint `submit-lead` accepte désormais les demandes
valides sans variable captcha, tout en rejetant les honeypots et les envois répétés.

Le runtime de navigateur intégré n’était pas disponible pendant cette passe : aucune
revue visuelle manuelle supplémentaire n’est revendiquée. Le test authentifié de bout en
bout nécessite au moins un compte réel.

## Vérifications du 30 juillet 2026

- installation propre `npm ci` : réussie ;
- ESLint et TypeScript strict : réussis ;
- Vitest : 47 tests réussis sur 47 ;
- build et prérendu : 47 routes réussies ;
- Guide Orée : 1 931 entrées issues de 96 fichiers, avec réponses commerciales
  contrôlées et tests de routage par intention ;
- crawlabilité : 19 routes publiques contrôlées avec 6 user-agents ;
- Playwright ciblé offre et rappel mobile : 12 tests réussis sur 12 dans Chromium et
  Mobile Safari ;
- Playwright ciblé Guide Orée et compositions mobiles : 7 scénarios réussis dans
  Chromium ;
- Playwright complet : 159 tests réussis et 11 scénarios connectés ignorés sans session
  client ou opérations réelle ;
- tests authentifiés réels : toujours conditionnés à la fourniture de comptes client et
  opérations.

## Configuration externe restant à fournir

- domaine de production et URLs de redirection Supabase Auth ;
- adresse d’envoi et fournisseur d’e-mail transactionnel ;
- fournisseur de calendrier externe si synchronisation bidirectionnelle souhaitée ;
- CRM/webhook éventuel ;
- GTM, GA4, Google Ads et conventions d’import des conversions qualifiées ;
- identité juridique, mentions légales, libellé fiscal et politique de confidentialité
  validés ;
- premier compte équipe à promouvoir en administrateur.

Lire aussi `docs/SUPABASE_BACKEND.md`, `docs/FINAL_MERGE_REPORT.md`,
`docs/UI_UX_SYSTEM.md` et `docs/IMAGE_DIRECTION.md`.
