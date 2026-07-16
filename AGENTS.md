# Instructions de continuité pour les agents IA

## Mission produit

Construire et maintenir une plateforme française de création de société, pensée d'abord pour l'acquisition Google Search. Le produit ne doit pas ressembler à une simple landing page : il doit relier une intention de recherche précise à un diagnostic adaptatif, une action commerciale qualifiée et un espace projet persistant.

Le produit cible principalement :

1. les créateurs seuls prêts à comparer SASU et EURL ;
2. les personnes qui savent qu'elles veulent une société mais pas quel statut ;
3. les salariés préparant une transition ;
4. les micro-entrepreneurs ou indépendants passant en société ;
5. les projets à plusieurs associés ;
6. les dossiers déjà commencés mais bloqués.

Les personnes cherchant uniquement une immatriculation gratuite de micro-entreprise ne doivent pas être confondues avec les prospects SASU/SAS/EURL/SARL.

## Décisions techniques fixées

- dépôt GitHub privé unique ;
- React 19 + TypeScript strict + Vite ;
- React Router DOM ;
- Tailwind CSS v4 ;
- Motion pour les animations ;
- React Hook Form + Zod ;
- TanStack Query ;
- Supabase comme autorité backend unique : Auth, PostgreSQL, RLS, Storage privé, Edge Functions ;
- Cloudflare Pages pour le frontend ;
- Vitest pour les règles et Playwright pour les parcours E2E ;
- contenu public versionné dans le code avant éventuel CMS ;
- mode démonstration complet quand Supabase n'est pas configuré.

Ne pas introduire un deuxième backend Cloudflare Pages Functions pour dupliquer les responsabilités de Supabase. Cloudflare héberge le frontend ; Supabase détient la donnée et les opérations sensibles.

## Principes de sécurité non négociables

- La clé `service_role` ne doit jamais être exposée au navigateur.
- Toute variable `VITE_*` est publique.
- RLS activée sur chaque table exposée.
- Aucun compte ne devient conseiller ou administrateur via un champ de profil éditable.
- Les rôles internes proviennent d'une table serveur et/ou de custom claims contrôlés.
- Les leads publics sont soumis par Edge Function, jamais par une policy d'insert anonyme ouverte.
- Les documents légaux vont dans un bucket privé avec URLs signées courtes.
- Un client ne peut ni valider ses propres documents ni modifier un statut opérationnel.
- Les données personnelles ne doivent pas être envoyées dans GA4 ou Google Ads comme paramètres bruts.

## Référence visuelle V3

La référence active est `docs/V3_REBUILD.md`, complétée par `docs/UI_UX_SYSTEM.md`. La palette est strictement dérivée de quatre couleurs : encre, blanc, bleu électrique et menthe. Le produit utilise deux familles typographiques seulement. Ne pas réintroduire de violet, orange, rose, gradients multicolores, blobs décoratifs ou troisième police. Préserver le header flottant, les navigations mobiles dédiées, le cockpit, le diagnostic avec feuille de route en direct, le dashboard centre de pilotage, le composant `AppPageHero` et le Guide Orée global.

Les images futures suivent `docs/IMAGE_DIRECTION.md` et ne doivent jamais remplacer une information, une preuve ou une action.

L'intégration active est documentée dans `docs/IMAGE_INVENTORY.md` et `docs/IMAGE_INTEGRATION_REPORT.md`. Les composants doivent consommer `app/content/imagery.ts`, jamais disperser des chemins bruts. Après ajout ou remplacement d'une source sélectionnée, exécuter `npm run images:optimize`. Ne pas publier les sources rejetées, associer une personne générée à une identité réelle, ni utiliser une image contenant un faux écran produit ou un document officiel inventé.

## Principes UX

- mobile-first ;
- design premium, précis, éditorial, non « AI template » ;
- mouvement utile : progression, validation, assemblage de dossier, transition d'étape ;
- pas de blobs néon aléatoires ni de glassmorphism excessif ;
- état vide, chargement, erreur, succès et reduced motion obligatoires ;
- l'utilisateur reçoit de la valeur avant d'être forcé à créer un compte ;
- le diagnostic sauvegarde seulement des réponses non sensibles en local ;
- chaque page Google doit correspondre exactement à l'intention du mot-clé.

## Cadre éditorial et juridique

- français clair, professionnel et rassurant ;
- ne jamais présenter l'orientation comme un conseil juridique automatique définitif ;
- distinguer honoraires, frais légaux et coûts tiers ;
- ne jamais inventer témoignages, partenaires, délais garantis ou taux de réussite ;
- toutes les coordonnées, offres et promesses de démonstration sont à valider ;
- la rédaction de statuts et le conseil juridique personnalisé doivent suivre le cadre professionnel réel du prestataire.

## Architecture fonctionnelle

### Public

- `/`
- `/comment-ca-marche`
- `/offres`
- `/accompagnement`
- `/choisir-statut`
- `/diagnostic`
- `/rendez-vous`
- `/creation-sasu`
- `/creation-eurl`
- `/creation-sas`
- `/creation-sarl`
- `/creer-entreprise-seul`
- `/creer-entreprise-a-plusieurs`
- `/creer-entreprise-en-etant-salarie`
- `/passer-micro-entreprise-en-societe`
- `/dossier-creation-entreprise-bloque`
- `/confidentialite`
- `/mentions-legales`

### Client

- `/app`
- `/app/projet`
- `/app/orientation`
- `/app/associes`
- `/app/documents`
- `/app/formalites`
- `/app/suivi`
- `/app/messages`
- `/app/rendez-vous`
- `/app/notifications`
- `/app/parametres`

### Opérations

- `/ops`
- `/ops/leads`
- `/ops/projets`
- `/ops/documents`
- `/ops/rendez-vous`
- `/ops/equipe`

## Diagnostic

Le moteur est déterministe et auditable. Conserver les versions des questions, règles, réponses et résultats. Les critères principaux sont : maturité du projet, nombre de fondateurs, situation professionnelle, structure actuelle, activité, clients existants, priorités et calendrier.

Les résultats doivent utiliser des formulations telles que : « votre projet semble devoir comparer… », avec points à valider et action suivante.

## Guide Orée

Le Guide Orée est un assistant de navigation local et auditable. Le script `scripts/generate-assistant-index.mjs` extrait les contenus du dépôt dans `app/generated/search-index.json`. Le composant combine cet index avec `app/content/knowledge.ts`.

Il doit pouvoir :

- retrouver une page ou une action à partir de mots approximatifs ;
- proposer plusieurs chemins ;
- rediriger vers la bonne route ;
- utiliser la reconnaissance vocale quand le navigateur la prend en charge ;
- fonctionner sans API payante.

Un futur LLM ne doit pas lire arbitrairement le filesystem de production. Il utilisera une base de connaissance contrôlée, versionnée et indexée, avec filtrage par permissions.

## Données et attribution

Conserver dès la première visite : UTM, GCLID, GBRAID, WBRAID, page d'entrée, referrer et date. Les événements principaux :

- `landing_view`
- `diagnostic_started`
- `diagnostic_step_completed`
- `diagnostic_completed`
- `orientation_viewed`
- `lead_submitted`
- `account_created`
- `appointment_booked`
- `project_created`
- `document_uploaded`
- `lead_qualified`
- `customer_won`

La finalité est de renvoyer à Google Ads les résultats `lead_qualified` puis `customer_won`, pas d'optimiser indéfiniment sur le simple formulaire.

## Règles de modification

- Ne pas supprimer une route ou un contenu sans mettre à jour l'index du Guide, le sitemap et la documentation.
- Ne pas appeler Supabase directement depuis des composants visuels ; passer par repositories/hooks.
- Ne pas stocker des secrets dans le code.
- Ne pas casser le mode démo.
- Exécuter `npm run check` avant livraison.
- Toute migration de base de données est commitée dans `supabase/migrations`.
- Toute modification de permission doit inclure un test RLS.

## État de livraison

Lire `docs/IMPLEMENTATION_STATUS.md` avant toute modification. La migration `0004_security_hardening.sql` crée les profils Auth, met à jour les horodatages et limite les colonnes projet modifiables depuis le navigateur. Les changements opérationnels sensibles doivent passer par une Edge Function ou une RPC contrôlée.
