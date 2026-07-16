# Rapport de refonte premium — passe V2 (archivée)

## Objectif

> Cette passe est conservée pour historique. La référence active est `docs/V3_REBUILD.md` et remplace les choix visuels ci-dessous.

Cette passe transformait le socle initial en produit visuel cohérent de niveau commercial : acquisition Google Search, diagnostic, espace client et opérations partagent désormais le même langage, la même hiérarchie et les mêmes standards responsive.

La refonte ne consiste pas à ajouter des effets décoratifs. Chaque amélioration vise au moins un objectif :

- comprendre plus vite la promesse ;
- identifier plus vite la prochaine action ;
- augmenter la confiance avant la collecte de coordonnées ;
- réduire la sensation de formulaire administratif ;
- maintenir la qualité après la page d'accueil ;
- rendre l'expérience crédible sur mobile, tablette et desktop ;
- préserver performance, accessibilité et reduced motion.

## Surfaces reconstruites

### Acquisition publique

- header flottant premium, barre de progression de lecture et mega-menu ;
- navigation mobile plein écran avec regroupement par besoin ;
- barre d'action mobile persistante ;
- footer éditorial et CTA final ;
- homepage entièrement recomposée ;
- pages Google Search spécialisées ;
- page de comparaison de statuts interactive ;
- fonctionnement, offres et accompagnement ;
- rendez-vous public ;
- pages légales et 404.

### Conversion

- diagnostic adaptatif avec progression desktop et mobile distincte ;
- cartes de choix plus lisibles ;
- feedback visuel et transitions d'étape ;
- résultat explicable ;
- collecte de contact séparée de la valeur initiale ;
- rendez-vous contextualisé.

### Espace client

- sidebar sombre premium ;
- navigation mobile inférieure et drawer complet ;
- header flottant ;
- tableau de bord bento ;
- héros métier partagés sur les pages secondaires ;
- projet, orientation, associés, documents, formalités, suivi, messages, rendez-vous et paramètres ;
- champs de formulaire, focus, hover et transitions harmonisés.

### Opérations

- navigation desktop et mobile ;
- cockpit de pilotage ;
- métriques, file prioritaire et segmentation ;
- tableaux et listes plus lisibles ;
- hiérarchie claire pour le traitement rapide des leads.

### Guide Orée

- launcher, panneau et résultats redessinés ;
- index actualisé automatiquement ;
- navigation et propositions directes conservées ;
- comportement mobile adapté aux barres d'action.

## Système visuel

### Palette

- encre profonde ;
- blanc et dérivés très légers ;
- bleu électrique pour les actions ;
- menthe pour la validation.

La V3 interdit désormais les anciennes couleurs violet, corail et ambre.

### Typographie

- Onest Variable comme famille principale, incluse localement dans le build ;
- Newsreader Variable comme accent éditorial secondaire limité ;
- titres en graisses 600 à 700, tracking modéré et échelle fluide ;
- textes longs limités en largeur ;
- micro-labels en capitales espacées uniquement pour les statuts et contextes.

### Surfaces

- glassmorphism réservé aux environnements sombres et aux overlays ;
- surfaces claires avec transparence et ombres modérées ;
- coins cohérents entre composants ;
- bordures plus légères que le contenu ;
- profondeur utilisée pour indiquer la priorité, pas pour décorer chaque carte.

### Motion

- transitions de routes publiques ;
- reveal progressif avec blur léger ;
- cockpit, progression, cartes et boutons avec animation utile ;
- hover avec élévation modérée sur desktop ;
- barres de progression et états qui réagissent aux choix ;
- `prefers-reduced-motion` reste respecté.

## Principes de conversion retenus

1. La promesse, l'action principale et la réassurance sont visibles immédiatement.
2. Les pages Google répondent à l'intention exacte avant de raconter la marque.
3. Le diagnostic donne de la valeur avant la demande de contact.
4. Les champs sont limités à l'information utile à l'étape courante.
5. Le produit montre un vrai espace après le formulaire.
6. Les coûts, responsabilités et incertitudes restent explicites.
7. Le mobile possède ses propres navigations et actions persistantes.
8. Les interactions restent rapides et compréhensibles sans animation.

## Fichiers structurants

- `app/styles.css`
- `app/components/layout/PublicHeader.tsx`
- `app/components/layout/PublicFooter.tsx`
- `app/components/layout/AppLayout.tsx`
- `app/components/layout/OpsLayout.tsx`
- `app/components/app/AppPageHero.tsx`
- `app/components/assistant/SmartAssistant.tsx`
- `app/pages/public/HomePage.tsx`
- `app/pages/public/AcquisitionLandingPage.tsx`
- `app/pages/public/DiagnosticPage.tsx`
- `app/pages/app/DashboardPage.tsx`
- `app/pages/ops/OpsDashboardPage.tsx`

## Règles pour les modifications futures

- ne pas remplacer la palette par des gradients aléatoires ;
- ne pas multiplier les effets de verre sur les surfaces claires ;
- conserver un CTA principal dominant par écran ;
- toujours vérifier mobile, tablette et desktop ;
- garder les pages d'acquisition plus directes que la homepage ;
- ne pas charger GSAP ou de lourdes animations sans bénéfice mesurable ;
- ne pas supprimer `prefers-reduced-motion` ;
- exécuter `npm run check` après toute passe significative.
