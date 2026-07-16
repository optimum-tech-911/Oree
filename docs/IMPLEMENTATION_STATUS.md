# État d'implémentation — V3

## Fonctionnel immédiatement, sans backend

- toutes les routes publiques et pages Google Search ;
- diagnostic adaptatif avec sauvegarde locale, résultat explicable et feuille de route en direct ;
- espace client complet en données de démonstration ;
- dashboard centre de pilotage ;
- espace opérations en données de démonstration ;
- Guide Orée global, visible, vocal et indexant automatiquement le dépôt ;
- recherche approximative, contexte de route et redirections actionnables ;
- consentement audience/publicité ;
- attribution UTM/GCLID/GBRAID/WBRAID ;
- palette stricte quatre couleurs et deux polices ;
- responsive mobile, tablette et desktop ;
- reduced motion, transitions, hover/tap et états d'interface ;
- build Cloudflare Pages et redirections SPA.

## Reconstruction V3 intégrée

- homepage reconstruite en conservant la force de la première version ;
- header éditorial sombre superposé au héros, transformation claire au défilement, mega-menu et navigation mobile ;
- cockpit de projet interactif ;
- sélecteur adaptatif des profils ;
- processus vivant et comparaison juridique ;
- assistant remis au premier plan sur le site et dans l'application ;
- diagnostic à trois zones sur grand écran ;
- dashboard transformé en centre de pilotage ;
- suppression des anciennes couleurs non conformes ;
- fallback d'identifiants lorsque `crypto.randomUUID` n'est pas disponible ;
- direction d'images de production documentée.

## Identité de marque et mouvement

- lock-up horizontal « Orée Entreprises » intégré au header public, aux espaces client/opérations et aux écrans d'authentification ;
- lock-up complet « Orée — Création & accompagnement d'entreprise » réservé au pied de page ;
- favicon ICO/PNG, icône Apple Touch, icônes Android et manifeste PWA reliés au document HTML ;
- optimisation reproductible des sources de marque via `npm run brand:optimize` ;
- CTA mobile « Démarrer » directement accessible dans le header et connexion explicitement nommée sur desktop ;
- Guide Orée retiré de la navigation principale et conservé comme aide flottante compacte ;
- révélations au scroll renforcées sur les sections et composants, avec mouvements plus lisibles et arrêt intégral en `prefers-reduced-motion` ;
- survols des CTA, cartes et liens renforcés avec élévation, sheen contrôlé et feedback d'appui ;
- ruban de l'écosystème des formalités sous le héros : dix logos fournis, défilement lent sur desktop, pause au survol ou au clavier et grille statique sur mobile ;
- organismes et acteurs présentés comme interlocuteurs possibles selon le dossier, avec une mention explicite indiquant que l'affichage des marques n'affirme aucun partenariat commercial ;
- héros d'accueil recomposé en carrousel plein cadre : cinq scènes, fondu éditorial, zoom progressif léger, sélection par onglets et pause accessible ;
- onglets du héros complétés par un numéro, une intention et un résumé utile, avec centrage automatique et défilement tactile sur mobile ;
- écran de chargement Orée complet avec identité, indicateur de progression et variante sans mouvement ;
- contenu du héros relié au défilement par une translation et une variation d'opacité légères, sans compromettre la lecture ni le mode reduced motion ;
- identité et CTA du header agrandis, avec couleurs de texte forcées par variante pour éviter toute disparition sur un fond identique.

## Imagerie professionnelle intégrée

- audit de 35 sources avec 13 sélections, 10 alternatives et 12 rejets ;
- exclusion des faux écrans, faux certificats et documents officiels inventés ;
- héros art-directed pour l'accueil, les formes juridiques et les intentions Google Ads ;
- scène humaine derrière le cockpit React sans remplacer la preuve produit ;
- sélecteur de parcours avec image active et navigation clavier ;
- accompagnement et rendez-vous illustrés sans faux nom, avis ni témoignage ;
- manifeste central `app/content/imagery.ts` ;
- composants média réutilisables AVIF/WebP ;
- optimisation locale reproductible via `npm run images:optimize` ;
- images générées signalées comme scènes illustratives dans l'interface.

Lire `docs/V3_REBUILD.md`, `docs/UI_UX_SYSTEM.md` et `docs/IMAGE_DIRECTION.md`.

## Audit fonctionnel et éditorial

- route « créer seul » dotée d'un contenu propre au lieu de reprendre la page SASU ;
- parcours « mot de passe oublié » et définition d'un nouveau mot de passe fonctionnels en démonstration et prêts pour Supabase Auth ;
- pages dédiées pour les notifications client, l'aide opérations et le profil opérations ;
- boutons de notification et de profil reliés à leurs destinations ;
- recherches actives dans les documents, les messages et les vues opérations ;
- filtres de chronologie, détails des éléments opérations et conversations système fonctionnels ;
- formulaires projet et paramètres conservés localement en mode démonstration ;
- ajout de pièces et de messages testable sans transmission externe ;
- export local des préférences de démonstration et demandes relatives aux données explicitement signalés ;
- suppression des boutons purement décoratifs présentés comme des actions ;
- retrait des identités de conseillers, citations et délais de réponse inventés ;
- réécriture des principaux contenus publics et applicatifs dans un français écrit, professionnel et juridiquement prudent ;
- suppression des détails techniques internes dans les réponses destinées au public ;
- sitemap complété avec l'ensemble des routes publiques indexables.
- contrôle Chromium renforcé : chaque route doit désormais présenter un titre Orée, afin qu'un serveur local étranger au projet ne puisse plus être accepté par erreur.

## Migration visuelle premium adviser

- palette maîtresse limitée à `#0B1220`, `#2457FF`, `#46D6A6` et `#F7F5EF`, y compris dans les utilitaires Tailwind et les valeurs RGBA dérivées ;
- Onest Variable et Newsreader Variable livrées localement dans le build, sans dépendance Google Fonts au chargement ;
- graisses typographiques normalisées, capitales espacées réduites et contrastes des textes sombres renforcés ;
- CTA principal bleu sur les espaces publics, client et opérations ; menthe réservée à la progression, au succès, à la sécurité et au Guide Orée ;
- navigation principale simplifiée, méga-menu opaque et contrasté, ouverture au clic, fermeture extérieure et touche Échap ;
- héros d'accueil recomposé en expérience plein cadre inspirée des grands sites industriels éditoriaux, sans reproduire leur identité ;
- images documentaires rendues visibles dans le processus et le choix d'accompagnement, avec libellés illustratifs et informations toujours portées par l'interface ;
- contrôle statique confirmant que le code applicatif ne contient que les quatre couleurs maîtresses en valeurs hexadécimales.

## Déjà scaffoldé pour Supabase

- Auth réelle et lecture sécurisée des rôles `staff_roles` ;
- protection `/app` et `/ops` activée automatiquement dès que les clés Supabase sont présentes ;
- schéma PostgreSQL, triggers de profil, horodatage et RLS ;
- bucket privé et règles Storage ;
- Edge Functions de soumission de lead, revendication et création de projet ;
- repositories frontend et contrats de données ;
- workflow GitHub manuel de migration staging/production.

## Connexions à terminer avec les comptes réels

- projet Supabase et variables d'environnement ;
- service email transactionnel et adresse d'expédition ;
- CRM ou Google Sheets ;
- fournisseur de rendez-vous/calendrier ;
- IDs GTM, GA4 et Google Ads ;
- validation Turnstile côté production ;
- validation juridique du nom commercial, coordonnées, tarifs et preuves sociales réelles ;
- remplacement futur des scènes illustratives par des photographies réelles consenties de l'équipe et des clients ;
- audit juridique des promesses et de l'orientation proposée ;
- éventuel LLM serveur avec base de connaissance et filtrage par permissions.

## Vérifications exécutées pendant la V3

- ESLint ;
- TypeScript strict ;
- tests unitaires ;
- build de production ;
- build mono-fichier de contrôle ;
- régénération de l'index du Guide ;
- inspection visuelle Chromium par injection du build mono-fichier ;
- ouverture réelle du Guide Orée ;
- inspection des pages homepage et diagnostic en desktop.

## Vérifications de l'intégration images

- 176 chemins du manifeste résolus sans fichier manquant ;
- exports AVIF/WebP inspectés sur desktop et mobile ;
- lint, TypeScript strict, 6 tests unitaires et build de production réussis ;
- 68 tests E2E Chromium réussis : chargement des 41 routes Orée, parcours fonctionnels, contrôle du méga-menu et du système visuel, absence de débordement horizontal à 390, 768, 1280, 1440 et 1728 px, identité, ruban de logos, carrousel, chargement de route, transformation du header, reduced motion, survol du CTA, audit automatisé du contraste des contrôles à fond plein sur toutes les routes et composition mobile sans chevauchement à 320, 360, 390 et 430 px ;
- réponse HTTP 200 pour l'application locale et le principal asset AVIF ;
- revue visuelle interactive multi-largeur à répéter lorsque le runtime de navigateur intégré est disponible ;
- projet Playwright Mobile Safari en attente du binaire WebKit local.

## Vérification locale recommandée

```bash
npm install
npm run check
npm run dev
npm run test:e2e
```

Inspecter au minimum les largeurs 390, 768, 1024, 1440 et 1728 px avec les contenus et images définitifs. Les tests E2E nécessitent l'installation locale des navigateurs Playwright.
