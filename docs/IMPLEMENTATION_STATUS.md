# État d’implémentation — V3 canonique

Mise à jour : 22 juillet 2026.

## État de livraison

Le dépôt V3 est l’application canonique. Les apports utiles de V4 ont été intégrés
fonction par fonction ; V4 n’est ni une seconde application ni une cible de déploiement.

Le projet Supabase `sksydcdkliuisaahysya` (`oree`) est lié et actif. Les migrations `0001` à
`0011` sont appliquées, les fonctions `submit-lead`, `claim-lead` et `create-project`
sont actives, et le lint distant ne remonte aucune erreur de schéma.

## Parcours publics

- pages d’acquisition par intention, contenus SEO et sitemap cohérents ;
- diagnostic adaptatif, déterministe, versionné et explicable ;
- valeur fournie avant création de compte ;
- reprise sécurisée du lead après authentification ;
- téléphone facultatif sauf demande de rappel ;
- consentement, attribution UTM/GCLID/GBRAID/WBRAID et analytics conditionnels ;
- Turnstile rendu explicitement, vérifié côté serveur et fermé par défaut sans secret ;
- Guide Orée local, vocal lorsque disponible, indexé depuis les contenus versionnés ;
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

## Vérifications du 22 juillet 2026

- ESLint : réussi ;
- TypeScript strict : réussi ;
- Vitest : 26 tests réussis sur 26 ;
- index Guide Orée : 1 685 entrées issues de 84 fichiers ;
- build Vite de production : réussi ;
- Supabase DB lint distant : aucune erreur ;
- historique distant : migrations `0001` à `0011` synchronisées ;
- trois Edge Functions : état `ACTIVE`.

La procédure d’intake `submit_lead_bundle` a aussi été exécutée dans une
transaction annulée sur le projet distant : l’écriture est valide et aucun lead
de test n’a été conservé. L’endpoint `submit-lead` répond correctement
`captcha_failed` sans jeton valide, ce qui confirme qu’il reste fermé par défaut.

Le runtime de navigateur intégré n’était pas disponible pendant cette passe : aucune
revue visuelle manuelle supplémentaire n’est revendiquée. Le test authentifié de bout en
bout nécessite au moins un compte réel.

## Configuration externe restant à fournir

- domaine de production et URLs de redirection Supabase Auth ;
- clés Turnstile site/secret et hôtes autorisés ;
- adresse d’envoi et fournisseur d’e-mail transactionnel ;
- fournisseur de calendrier externe si synchronisation bidirectionnelle souhaitée ;
- CRM/webhook éventuel ;
- GTM, GA4, Google Ads et conventions d’import des conversions qualifiées ;
- identité juridique, coordonnées, offres, tarifs et politique de confidentialité validés ;
- premier compte équipe à promouvoir en administrateur.

Lire aussi `docs/SUPABASE_BACKEND.md`, `docs/FINAL_MERGE_REPORT.md`,
`docs/UI_UX_SYSTEM.md` et `docs/IMAGE_DIRECTION.md`.
