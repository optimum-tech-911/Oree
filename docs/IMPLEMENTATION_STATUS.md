# État d’implémentation — V3 canonique

Mise à jour : 4 août 2026.

## État de livraison

Le dépôt V3 est l’application canonique. Les apports utiles de V4 ont été intégrés
fonction par fonction ; V4 n’est ni une seconde application ni une cible de déploiement.

Le projet Supabase `sksydcdkliuisaahysya` (`oree`) est lié et actif. Les migrations `0001` à
`0014` sont appliquées, les fonctions `submit-lead`, `claim-lead` et `create-project`
sont actives, et la version de `submit-lead` qui traite les demandes de rappel est
déployée.

## Offre commerciale et acquisition Ads

- source typée unique pour le forfait société à 600 € TTC tout compris et la création de
  micro-entreprise à 100 € ;
- offre société active pour SASU, EURL, SAS et SARL, sans supplément selon la forme ;
- accueil, tarifs, accompagnement, diagnostic et landings de forme alignés ;
- quatre actions d’acquisition : démarrage, rappel, téléphone et WhatsApp ;
- formulaire de rappel court soumis par l’Edge Function sécurisée existante ;
- événements de conversion typés, dédupliqués et filtrés contre les données
  personnelles ;
- file leads enrichie pour l’attribution Ads, les relances, notes, motifs et résultats ;
- demandes de rappel persistées explicitement, prioritaires et signalées dans `/ops/leads` ;
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
- validation Tag Assistant sur le domaine déployé et conventions d’import des
  conversions qualifiées ;
- identité juridique, mentions légales, libellé fiscal et politique de confidentialité
  validés ;

Lire aussi `docs/SUPABASE_BACKEND.md`, `docs/FINAL_MERGE_REPORT.md`,
`docs/UI_UX_SYSTEM.md` et `docs/IMAGE_DIRECTION.md`.

## Vérifications du 4 août 2026 — landing SASU et suivi des appels

- offre centrale harmonisée sur `600 € TTC tout compris` avec les quatre inclusions
  confirmées ;
- landing SASU reconstruite autour de l’appel, du rappel et d’un design éditorial plus
  humain, sans faux témoignage, faux membre d’équipe ou faux horaire ;
- configuration Google existante réutilisée : un chargeur, GA4 `G-FL6QMMYVLM`, action
  appel Ads `AW-18362621917/mQHqCLOG6tscEN2__bNE`, numéro `07 87 82 32 08` ;
- conservation de GCLID/UTM vérifiée et événements diagnostiques `phone_click`,
  `callback_request` et `whatsapp_click` reliés à l’abstraction analytics existante ;
- `npm ci`, ESLint, TypeScript strict, 48 tests Vitest et build/prérendu réussis ;
- crawlabilité réussie sur 19 routes et 6 user-agents ;
- Playwright complet : 175 tests réussis, 11 scénarios authentifiés ignorés sans comptes
  réels, aucun échec ;
- responsive SASU vérifié à 375, 390, 430, 768 et 1 440 px dans Chromium et Mobile
  Safari, avec contrôles de contraste, débordement, CTA, téléphone et rappel.

Le navigateur intégré n’était pas disponible pendant cette passe. La validation
visuelle est donc fondée sur les rendus de test et la matrice Playwright ; aucune revue
interactive via le navigateur intégré n’est revendiquée. Une vérification Tag Assistant
sur le domaine réellement déployé reste nécessaire avant activation Google Ads.

## Vérifications du 4 août 2026 — visuel SASU et file de rappel

- portrait SASU remplacé par la scène quotidienne `pathway-home-founder`, déjà auditée
  et optimisée, avec recadrages desktop et mobile ;
- demande de rappel persistée par la migration additive `0014`, triée en priorité et
  signalée dans `/ops/leads` avec accès direct au téléphone, WhatsApp et e-mail ;
- compatibilité vérifiée avec un frontend livré avant la migration `0014` ;
- Edge Function distante joignable : le smoke test honeypot a répondu `202` sans créer
  de lead de test ;
- `npm run check` réussi : ESLint, TypeScript strict, 51 tests Vitest, build et prérendu
  de 25 routes ;
- 4 scénarios Playwright ciblés réussis dans Chromium et Mobile Safari pour le visuel
  SASU et la soumission du formulaire de rappel ;
- captures locales inspectées pour le héros SASU et la file opérations en mode démo.

## Déploiement Supabase du 4 août 2026

- migrations `0013_offer_and_ads_lead_workflow.sql` et
  `0014_callback_request_visibility.sql` appliquées et enregistrées dans l’historique ;
- `submit-lead` redéployée avec la notification explicite « Demande de rappel » ;
- vérification distante : champ `leads.callback_requested`, procédure
  `submit_lead_bundle` et un administrateur actif présents ;
- test transactionnel annulé : une demande SASU avec rappel est marquée
  `callback_requested = true`, canal `phone`, sans conserver de lead de test ;
- endpoint public vérifié via honeypot : réponse `202`, sans écriture de données.

## Correction CORS du 5 août 2026

- cause observée en production : l’Edge Function renvoyait `Access-Control-Allow-Origin:
  http://localhost:5173` à l’origine `https://oree.optimutech.fr`, ce qui bloquait le
  formulaire de rappel avant toute écriture ;
- secret `ALLOWED_ORIGINS` mis à jour pour inclure localhost et le domaine de production ;
- `submit-lead`, `claim-lead` et `create-project` redéployées avec un helper CORS qui ne
  renvoie jamais une origine différente lorsqu’une requête est refusée ;
- préflight production confirmé avec l’origine attendue ;
- soumission réelle de vérification confirmée : réponse `201`, claim token émis et lead
  SASU créé avec `callback_requested = true`, puis suppression vérifiée du seul lead
  synthétique (`0` restant).
