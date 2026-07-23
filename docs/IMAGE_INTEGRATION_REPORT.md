# Rapport d'intégration des images

## Périmètre livré

L'intégration conserve le diagnostic, le cockpit React, le Guide Orée, les espaces client/opérations, les repositories Supabase et le suivi d'attribution. Les images enrichissent le produit sans porter seules une preuve, une information ou une action.

## Sélection et placements

- Accueil : `hero-home-company-journey` occupe le panneau humain du héros 55/45 ; le cockpit produit réel se superpose sans masquer la scène.
- Sélecteur de parcours : six intentions utilisent une image dédiée et ne chargent que la scène active.
- Activités : un sélecteur interactif n'affiche qu'une scène active parmi artisanat, commerce, services terrain, restauration et logistique ; il évite de charger une galerie complète sur mobile.
- Parcours accueil : les scènes « projet chez soi » et « associés en discussion » remplacent les visuels génériques des entrées solo et équipe.
- Landing pages : images distinctes pour SASU, EURL, SAS, SARL, salarié, activité existante et dossier bloqué.
- Choix du statut : scène de décision derrière le comparateur React.
- Processus : `process-project-organisation` forme un fond documentaire lisible dans le rail des six étapes, avec un dégradé dérivé de la palette pour préserver le texte.
- Offres : la scène d'accompagnement donne un contexte humain au choix du niveau de service, sans être présentée comme une photo d'équipe réelle.
- Accompagnement : scène d'explication humaine, explicitement indiquée comme illustrative.
- Rendez-vous : scène de visioconférence secondaire sur grand écran ; le sélecteur de créneau reste prioritaire.

Les 12 rejets sont documentés dans `docs/IMAGE_INVENTORY.md`. Les faux écrans produit, confirmations d'immatriculation, certificats et documents pseudo-officiels ne sont pas livrés dans `public/`.

## Variantes mobiles et recadrage

Les héros et scènes humaines disposent de recadrages 4:5 issus de la même source. Les points focaux sont déclarés dans `app/content/imagery.ts`. Le texte et les CTA ne sont jamais intégrés dans les pixels.

Le composant `ArtDirectedPicture` choisit les sources mobiles sous 768 px. Le conteneur fixe le ratio visuel pour éviter le déplacement de mise en page pendant le chargement.

## Performance

- 21 sources sélectionnées donnent 298 variantes AVIF/WebP après la dernière optimisation.
- Le dossier public d'images pèse environ 9,6 Mo au total ; une route ne charge qu'une fraction de ce volume et les nouvelles scènes restent lazy.
- Le principal visuel de chaque héros est eager avec `fetchPriority="high"`.
- Les images hors écran restent lazy.
- Les tailles disponibles sont 480/640/720/800/960/1280/1448/1586 selon le composant et la source.
- Les fichiers sont servis depuis `public/`, sans import JavaScript lourd ni chargement transversal entre routes.

La commande reproductible est :

```bash
npm run images:optimize
```

Elle utilise Sharp localement, nettoie uniquement `public/assets/imagery/`, puis régénère les formats ouverts sans service propriétaire.

## Accessibilité et confiance

- Alt text en français, spécifique au contexte.
- Dimensions intrinsèques, ratios stables et fond de chargement.
- Toutes les informations et actions restent disponibles sans l'image.
- Les scènes générées sont marquées « Scène illustrative » ou « Situation illustrative ».
- Aucun nom, avis, note, taux de réussite ou résultat client n'est associé aux personnes générées.
- Le mode `prefers-reduced-motion` désactive les zooms, transitions et profondeurs animées.

## Composants

- `ResponsiveImage`
- `ArtDirectedPicture`
- `HeroMedia`
- `PathwayMediaSwitcher`
- `ProcessRail` avec fond documentaire art-directed
- `EditorialMediaCard`
- `HumanTrustPanel`
- `TestimonialIllustration`
- `AppEmptyState`

`TestimonialIllustration` impose le libellé « Situation illustrative ». Aucun faux témoignage n'est ajouté à l'interface actuelle. `AppEmptyState` est disponible pour de futurs états réellement vides sans imposer de photographie aux écrans métier existants.

## Éléments à remplacer par de vraies photographies

Avant une communication institutionnelle centrée sur l'équipe, remplacer les scènes d'accompagnement par des prises de vue consenties des intervenants réels. Lorsque de vrais cas clients sont disponibles, obtenir leur autorisation écrite et séparer clairement témoignages vérifiés et exemples pédagogiques.

Les captures du produit doivent toujours provenir de l'interface React réelle. Les documents officiels devront être photographiés ou capturés uniquement avec autorisation, données masquées et contexte non trompeur.

## Limite de vérification dans cette session

Le runtime de navigateur intégré n'était pas disponible. Les vérifications de code, de chemins, de build et les tests automatisés ont été exécutés ; la revue visuelle interactive multi-largeur doit être répétée dans Chromium dès que ce runtime est accessible.

## Vérifications exécutées

- `npm install --save-dev sharp` ;
- `npm run images:optimize` — 21 sources, 298 sorties, 9,6 Mo ;
- contrôle automatisé du manifeste — 298 chemins résolus, 0 manquant ;
- `npm run check` — lint, TypeScript strict, 6 tests unitaires et build de production réussis ;
- la suite Chromium contrôle également le méga-menu, les polices, le CTA bleu, le chargement des images et l'absence de débordement horizontal aux largeurs 390, 768, 1440 et 1728 px ;
- contrôle HTTP local — page d'accueil et ressource AVIF servies en `200 OK` ;
- inspection directe des exports desktop et mobiles retenus.

La configuration E2E complète comporte aussi un projet Mobile Safari. Son exécution locale nécessite encore l'installation du binaire WebKit Playwright ; cet échec d'environnement ne concerne pas le code Chromium validé.
