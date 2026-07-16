# Guide Orée

## Version livrée

Le Guide Orée est un moteur local de recherche et de navigation. Il ne dépend d'aucune API payante et ne fabrique pas de réponses juridiques.

Sources :

- base contrôlée : `app/content/knowledge.ts` ;
- index généré : `app/generated/search-index.json` ;
- script : `scripts/generate-assistant-index.mjs`.

Le script analyse les fichiers du projet, extrait des chaînes françaises utiles et les associe à des routes. Il s'exécute avant `dev` et `build`.

## Capacités

- recherche tolérante par mots-clés ;
- propositions de pages et actions ;
- navigation directe ;
- suggestions contextuelles ;
- reconnaissance vocale si disponible ;
- fonctionnement dans les espaces public, client et opérations.

## Limites assumées

- pas de conseil juridique ;
- pas d'accès à des documents privés en dehors des permissions de l'utilisateur ;
- pas de lecture arbitraire du filesystem en production ;
- pas de garantie de compréhension sémantique équivalente à un LLM.

## Évolution LLM/RAG

Une future version peut :

1. générer un index structuré à chaque build ;
2. publier les contenus approuvés dans une table de connaissance ;
3. créer des embeddings ;
4. filtrer les documents par `project_id` et droits RLS ;
5. appeler une Edge Function qui contrôle le contexte ;
6. renvoyer réponse, sources et actions autorisées.

Ne jamais envoyer l'ensemble des documents d'autres clients au modèle. Toute récupération doit être filtrée avant l'appel.
