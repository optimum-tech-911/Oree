# Direction et intégration des images

## Objectif

Les images doivent renforcer la confiance, la réalité humaine et le contexte français de création d'entreprise. Elles ne doivent jamais ressembler à des banques d'images génériques ni à des portraits IA parfaits.

## Style commun

- photographie éditoriale réaliste ;
- lumière naturelle ou lumière de bureau crédible ;
- imperfections de peau, tissus et environnements conservées ;
- cadrages documentaires, souvent légèrement décentrés ;
- palette compatible : encre, blanc, bleu électrique et touches menthe ;
- absence de texte généré dans l'image ;
- aucun logo fictif visible ;
- diversité crédible de profils et d'activités en France ;
- contraste suffisant pour permettre une superposition de texte lorsqu'elle est prévue.

## Emplacements recommandés

### 1. Portrait conseiller

- chemin : `public/assets/images/advisor-camille.webp`
- ratio : 4:5
- usage : accompagnement, rendez-vous, espace client
- scène : conseillère française dans un bureau sobre, regard direct mais naturel, posture accessible, lumière latérale douce

### 2. Salarié préparant son projet

- chemin : `public/assets/images/path-employee.webp`
- ratio : 16:10
- usage : page salarié et sélecteur de parcours
- scène : personne travaillant le soir sur un projet, environnement domestique ou coworking crédible, documents et ordinateur sans écrans illisibles

### 3. Projet à plusieurs

- chemin : `public/assets/images/path-founders.webp`
- ratio : 16:10
- usage : création SAS/SARL
- scène : deux ou trois associés autour d'une table, échange réel, documents et gestes naturels, pas de pose publicitaire

### 4. Indépendant en croissance

- chemin : `public/assets/images/path-existing-business.webp`
- ratio : 16:10
- usage : passage micro vers société
- scène : professionnel déjà actif, commandes ou planning visibles sans données personnelles, sensation de croissance opérationnelle

### 5. Documents et formalités

- chemin : `public/assets/images/documents-workflow.webp`
- ratio : 3:2
- usage : fonctionnement et documents
- scène : main, dossier, ordinateur, signature ou classement ; aucun faux document juridique lisible

### 6. Activités sectorielles

Créer ensuite des séries cohérentes pour : conseil/numérique, commerce, artisanat, restauration, transport et services. Chaque série doit garder le même traitement colorimétrique et le même niveau de réalisme.

## Formats

- source maître haute résolution ;
- export AVIF et WebP ;
- plusieurs tailles responsives ;
- poster fixe si une séquence vidéo est ajoutée ;
- aucun fichier lourd chargé avant interaction ou visibilité ;
- texte alternatif défini dans le contenu, pas dans le nom de fichier.

## Règle d'intégration

Le produit doit rester complet sans image. Une image enrichit une section mais ne porte jamais seule une information, un CTA ou une preuve. Ne pas remplacer le cockpit, la progression ou le diagnostic par une simple photographie.

## Bibliothèque intégrée

L'audit détaillé des 43 sources se trouve dans `docs/IMAGE_INVENTORY.md`. Vingt-et-une scènes sont retenues ; les autres restent hors du chemin public. Les fichiers de production vivent dans `public/assets/imagery/` et leur métadonnée accessible est centralisée dans `app/content/imagery.ts`.

Règles actives :

- les images humaines générées portent un libellé illustratif dans le contexte où elles pourraient être prises pour une personne réelle ;
- aucun portrait n'est associé à un nom, un témoignage ou une fonction réelle ;
- aucun faux écran produit, Kbis, certificat ou document pseudo-officiel n'est livré ;
- le cockpit et les comparateurs restent construits en React ;
- les pages client et opérations restent interface-first.

### Marques tierces et organismes

Les images de logos d'organismes ou de banques ne constituent pas une preuve de partenariat. Les fichiers fournis peuvent apparaître dans le rail éditorial de l'écosystème, à condition de conserver la mention informative visible et de ne jamais les présenter comme des partenaires, clients ou soutiens d'Orée. Leur affichage doit être retiré ou remplacé si le détenteur de la marque l'exige.

## Optimisation reproductible

```bash
npm run images:optimize
```

Le script `scripts/optimize-images.ts` génère localement AVIF et WebP avec plusieurs largeurs, ainsi que les recadrages mobiles 4:5. Il ne doit jamais être remplacé par une dépendance à un service payant. Après ajout ou remplacement d'une source, mettre à jour ensemble le script, le manifeste et l'inventaire.
