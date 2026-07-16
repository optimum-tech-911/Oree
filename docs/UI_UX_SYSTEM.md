# Système UI/UX — référence V3

## Direction

Orée doit ressembler à un produit conçu par une équipe de marque et de produit, pas à un template SaaS généré automatiquement. La direction combine précision fintech, clarté éditoriale et mouvement opérationnel. Chaque animation doit illustrer une progression, une validation, une relation ou une prochaine action.

## Palette stricte : quatre couleurs visuelles

Toute l'interface dérive de quatre couleurs de base seulement :

1. **Encre profonde** — `#0B1220` : confiance, navigation, espaces projet et contrastes forts.
2. **Bleu d'action** — `#2457FF` : CTA principal, orientation active, lien et focus.
3. **Menthe de signal** — `#46D6A6` : validation, progression, sécurité et présence du Guide Orée.
4. **Blanc chaud** — `#F7F5EF` : lecture, respirations, formulaires et surfaces principales.

Les tons `--paper`, `--ink-2`, `--accent-deep` et `--mint-soft` sont uniquement des dérivés de luminosité de ces quatre couleurs. Ne jamais introduire de violet, orange, rouge, rose ou vert indépendant. Les anciennes variables sémantiques restent mappées sur cette palette afin de préserver la compatibilité du code.

## Deux familles typographiques

- `--font-sans` : **Onest Variable**, livrée localement avec le build. Utilisée pour toute l'interface, les formulaires, la navigation, les chiffres et les textes.
- `--font-editorial` : **Newsreader Variable**, livrée localement avec le build. Réservée à une courte expression éditoriale dans certains grands titres.

Ne pas ajouter une troisième police. L'éditorial ne doit jamais être utilisé pour les libellés, formulaires ou tableaux.

## Hiérarchie

- Titres principaux en graisse 600 à 700, tracking négatif modéré et interlignage maîtrisé.
- Graisses 800 et 900 interdites dans l'interface courante ; les anciennes classes `font-extrabold` sont normalisées à 650 pendant la migration.
- Un seul geste éditorial par bloc, généralement avec `.editorial-mark`.
- Capitales espacées limitées aux statuts et micro-libellés réellement utiles.
- Paragraphes limités en largeur et rédigés en français direct.
- Un CTA dominant par écran ; les actions secondaires restent visibles sans concurrencer la principale.

## Rédaction d'interface

- Employer un français écrit, précis et professionnel, avec des phrases complètes.
- Préférer les faits, les conditions et les conséquences pratiques aux slogans ou aux métaphores publicitaires.
- Éviter les fragments de phrase, les formules orales, les anglicismes non nécessaires et les oppositions artificielles du type « pas seulement » ou « jamais opaque ».
- Nommer clairement l'objet de l'action : « Transmettre un justificatif conforme » plutôt que « Débloquer la suite ».
- Distinguer une orientation indicative, une validation professionnelle et une décision définitive.
- Ne pas exposer au public les détails d'implémentation tels que les noms de services, les fonctions serveur ou les règles de base de données, sauf dans une documentation technique destinée à cet usage.
- Ne jamais inventer un nom de conseiller, une citation, un délai moyen, une disponibilité ou une preuve sociale. Employer une désignation fonctionnelle tant que l'identité réelle n'est pas validée.
- Les limites du mode démonstration doivent être formulées sobrement et au moment où elles affectent réellement une action.

## Mouvement

Mouvements autorisés :

- progression d'un dossier ;
- changement d'étape ;
- assemblage ou validation de documents ;
- changement de parcours dans le diagnostic ;
- révélation au scroll ;
- navigation et ouverture du Guide Orée ;
- feedback hover/tap utile ;
- micro-scan sur une étape active.

Mouvements interdits :

- blobs néon aléatoires ;
- cartes flottant sans signification ;
- parallaxe lourde ;
- animation permanente de tous les éléments ;
- texte essentiel dépendant d'une animation ;
- vidéo de fond qui retarde la compréhension du mot-clé Google.

Toujours respecter `prefers-reduced-motion`.

### Rythme des interactions

- les sections entrent dans le viewport par une translation verticale courte, une opacité progressive et un flou léger ;
- les révélations imbriquées peuvent être légèrement décalées, sans retarder la lecture ni animer chaque mot ;
- les CTA forts utilisent une élévation nette, un reflet bref et un feedback d'appui ;
- le contenu du héros peut accompagner le premier défilement par une translation inférieure à 52 px et une variation d'opacité limitée ;
- le changement de route affiche l'identité Orée, une progression courte et un retour lisible même quand les images se chargent encore ;
- le ruban de formalités effectue une boucle linéaire de 38 secondes et se suspend au survol, au focus et en reduced motion ;
- sur mobile, ce ruban devient une grille statique afin que la compréhension ne dépende jamais du mouvement.

## Identité Orée

- navigation : lock-up horizontal « Orée Entreprises » ;
- pied de page : lock-up complet avec le descriptif « Création & accompagnement d'entreprise » ;
- contextes compacts : monogramme fourni dans les actifs de marque ;
- contextes sombres : version monochrome inversée du même lock-up, jamais un symbole concurrent ;
- favicon, Apple Touch et manifeste installable utilisent les icônes dédiées fournies avec l'identité.

Les fichiers web optimisés vivent dans `public/assets/brand/`. Les sources maîtres restent dans `oree logos/` et sont traitées par `npm run brand:optimize`.

## Organismes et confiance institutionnelle

Le rail placé sous le héros s'intitule « Écosystème de formalités ». Il explique les organismes et interlocuteurs susceptibles d'intervenir selon l'activité, la structure et le dossier. Il ne doit jamais employer « nos partenaires », « nous travaillons avec » ou une formulation équivalente sans preuve contractuelle vérifiée.

Les dix fichiers fournis sont affichés comme repères visuels informatifs, avec une mention permanente précisant que leur présence ne constitue pas l'affirmation d'un partenariat commercial. Ils ne doivent pas être accompagnés d'une promesse, d'une recommandation ou d'un transfert automatique non vérifié.

## Surfaces

- Le héros d'accueil utilise un carrousel plein cadre : photographie immersive, voile de contraste, message à gauche, CTA larges, onglets narratifs renseignés et contrôle de pause.
- Au sommet de l'accueil, le header est une barre sombre superposée à l'image. Après le premier défilement, il devient une surface blanc chaud flottante afin de rester lisible sur les sections éditoriales.
- Les héros sombres servent à focaliser une intention ; les surfaces blanc chaud servent à lire, comparer et agir.
- Le glassmorphism est réservé au header flottant, au cockpit et à quelques contrôles sur fond sombre.
- Les cartes publiques doivent former une composition continue, pas une succession de rectangles identiques.
- Les bordures, grilles blueprint et ombres utilisent uniquement l'encre avec transparence.

## Responsive

### Mobile

- navigation publique plein écran ;
- CTA de conversion accessible ;
- Guide Orée toujours visible sans masquer l'action principale ;
- navigation client inférieure ;
- formulaires sur une colonne ;
- zones tactiles d'au moins 44 px ;
- onglets du héros lisibles, défilables horizontalement et centrés sur l'intention active ;
- aucune collision entre l'action principale, le Guide Orée, le contrôle de pause et les onglets du héros ;
- aucune interaction critique dépendante du hover.

### Tablette

- compositions dédiées, pas un desktop simplement réduit ;
- grilles deux colonnes lorsque la largeur réelle le permet ;
- sidebars converties en rails ou drawers ;
- titres et espacements intermédiaires.

### Desktop

- header flottant et mega-menu ;
- cockpit et compositions asymétriques ;
- sidebars persistantes client/opérations ;
- aperçus contextuels dans le diagnostic ;
- hover précis, jamais décoratif.

## Composants de référence

- `HeroCockpit` : état vivant du projet ;
- `DynamicHeroCarousel` : cinq intentions, scènes responsives, zoom lent, fondu, onglets et pause ;
- `ProcessRail` : progression interactive ;
- `DiagnosticPage` : questionnaire adaptatif + feuille de route en direct ;
- `SmartAssistant` : recherche, explication et redirection ;
- `DashboardPage` : centre de pilotage du projet ;
- `AppPageHero` : continuité des pages client ;
- `Button` : variantes limitées et sheen réservé aux CTA forts.

## Images

Les images futures ne doivent pas devenir des fonds décoratifs génériques. Elles doivent montrer un contexte entrepreneurial français crédible, des personnes imparfaites et réalistes, des gestes de travail, des documents ou des lieux cohérents. Lire `docs/IMAGE_DIRECTION.md` avant toute génération ou intégration.

### Composants média

- `ResponsiveImage` : AVIF/WebP, dimensions intrinsèques, priorité et chargement contrôlés ;
- `ArtDirectedPicture` : source et ratio mobiles dédiés ;
- `HeroMedia` : photographie environnementale et preuve produit React superposée ;
- `PathwayMediaSwitcher` : changement d'intention au focus, hover ou clic avec contenu complet ;
- `ProcessRail` : image documentaire en fond contextualisé, avec l'information et les contrôles toujours construits en React ;
- `HumanTrustPanel` : scène d'accompagnement avec statut illustratif explicite ;
- `EditorialMediaCard`, `TestimonialIllustration` et `AppEmptyState` : usages secondaires et encadrés.

Une seule image de héros par route reçoit `fetchPriority="high"`. Toute image sous la ligne de flottaison reste lazy. Les transitions média sont des fondus ou des variations de profondeur inférieures à 1.025 et s'arrêtent en reduced motion.

## Accessibilité

- navigation clavier et focus visible ;
- contrastes vérifiés avec les contenus définitifs ;
- état jamais communiqué uniquement par la couleur ;
- messages d'erreur proches de l'action ;
- textes alternatifs informatifs ;
- aucune information essentielle intégrée dans une image.
