# GitHub et Cloudflare Pages

## Dépôt

Créer un dépôt GitHub privé, pousser le contenu, protéger `main` et imposer les pull requests.

## Cloudflare Pages

```text
Build command: npm run build
Output directory: dist
Production branch: main
Node.js: 22
```

Ajouter les variables publiques par environnement. Ne jamais ajouter les secrets Supabase serveur dans Cloudflare puisque les opérations sensibles s'exécutent dans Supabase Edge Functions.

## Routes SPA

`public/_redirects` contient la réécriture vers `index.html`. Tester directement une route telle que `/app/documents` après déploiement.

## Headers

`public/_headers` fournit une base. Introduire CSP en Report-Only, observer les violations, puis imposer la policy exacte pour Supabase, Google et les services retenus.

## Branches

- `main` : production ;
- `develop` : staging ;
- `feature/*` : previews.

Les previews ne doivent jamais utiliser la base production.
