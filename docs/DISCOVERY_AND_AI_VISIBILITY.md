# Découverte publique et visibilité dans les réponses génératives

## Objectif

Orée publie trois ressources cohérentes à la racine du domaine :

- `sitemap.xml` pour les URL publiques canoniques ;
- `robots.txt` pour autoriser l’exploration publique tout en excluant les espaces
  privés ;
- `llms.txt` pour présenter le service, les situations pertinentes, l’offre confirmée,
  les limites et les pages de référence dans un format Markdown concis.

`llms.txt` facilite la compréhension du site par les agents qui choisissent de le lire.
Il ne garantit ni citation, ni indexation, ni recommandation par un modèle.

## Sources de vérité

- routes, titres, descriptions et domaine : `scripts/crawlability-routes.mjs` ;
- prix, inclusions, exclusions et contact : `app/config/commercial-offers.ts` ;
- génération : `scripts/generate-discovery-files.ts`.

Les fichiers publics ne doivent pas être édités manuellement. Exécuter :

```sh
npm run discovery:generate
```

La commande est également lancée avant le serveur de développement et chaque build.

## Principes appliqués

- uniquement les pages canoniques que nous souhaitons voir indexées ;
- aucune route de connexion, client, opérations ou authentification dans le sitemap ;
- aucune valeur `priority` ou `changefreq`, ignorée par Google ;
- aucun `lastmod` artificiel : il ne sera ajouté que lorsqu’il pourra refléter de façon
  fiable une modification significative de chaque page ;
- liens absolus, encodage UTF-8 et types de contenu explicites ;
- prix et périmètre repris depuis la configuration commerciale centrale ;
- limites juridiques, commerciales et fiscales explicites ;
- aucune donnée privée, aucun paramètre de campagne et aucune promesse invérifiable.

## Maintenance

Toute nouvelle page publique indexable doit être ajoutée à
`scripts/crawlability-routes.mjs`. Le générateur l’ajoute ensuite au sitemap et la
validation impose qu’elle soit également présente dans `llms.txt`.

Après modification, exécuter :

```sh
npm run check
npm run crawlability:check
```
