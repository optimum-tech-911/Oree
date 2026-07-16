# Refonte V3 — reconstruction de l'expérience

## Pourquoi cette passe existe

La première refonte avait ajouté du style mais avait perdu une partie de la clarté et de la personnalité de la version initiale. Cette passe repart du dépôt réel et conserve les points forts de la première version : promesse directe, héros sombre, cockpit de projet, continuité vers l'espace client et assistant visible.

## Changements structurants

- palette réduite et contrôlée à quatre couleurs ;
- deux familles typographiques seulement ;
- homepage reconstruite autour de l'intention Google et du projet vivant ;
- header, mega-menu et mobile menu revus ;
- parcours utilisateurs interactifs au lieu de cartes statiques ;
- processus animé par étapes ;
- dashboard transformé en centre de pilotage ;
- diagnostic enrichi d'une feuille de route en direct ;
- Guide Orée restauré comme fonctionnalité globale et visible ;
- assistant compatible avec les environnements sans `crypto.randomUUID` ;
- suppression des anciennes couleurs violettes/orange/rose ;
- états mobile/tablette/desktop harmonisés ;
- documentation image et règles de continuité ajoutées.

## Critère de qualité

Un écran ne doit pas seulement être « beau ». En moins de quelques secondes, l'utilisateur doit comprendre :

1. où il se trouve ;
2. ce que la plateforme sait de son projet ;
3. quelle action est prioritaire ;
4. comment obtenir une explication ;
5. ce qui se passera ensuite.

## Guide Orée

Le Guide est injecté globalement hors écrans d'authentification. Il possède :

- un launcher flottant explicite ;
- le raccourci `Cmd/Ctrl + K` ;
- reconnaissance vocale quand disponible ;
- contexte de route ;
- index automatique des fichiers et contenus ;
- base de connaissances métier ;
- redirections actionnables ;
- architecture prête pour un LLM serveur Supabase avec permissions.

Le prototype ne prétend pas remplacer un modèle de langage : il fournit immédiatement une recherche intelligente locale, rapide et auditable, puis documente le branchement IA sécurisé futur.
