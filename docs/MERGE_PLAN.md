# Plan de fusion V3 / V4

## Décisions exécutables

1. Conserver V3 comme application et ne modifier ni `.env`, ni `package-lock.json`, ni
   Supabase, ni Cloudflare.
2. Ajouter les éléments V4 qui complètent réellement V3 : routes `/tarifs` et
   `/creer-entreprise-demandeur-emploi`, contenu dédié, parcours diagnostic
   situation-first et instrumentation consentie.
3. Réemployer les primitives, styles et images V3 ; aucune copie de composants ou
   d’assets V4 ne sera faite lorsqu’un équivalent V3 est plus complet.
4. Mettre à jour le sitemap, l’index Guide et les tests route/diagnostic.
5. Vérifier lint, TypeScript, tests, build et les tests E2E disponibles. Les inspections
   de navigateur locales restent à rejouer si les binaires Playwright ne sont pas
   installés.

## Phases et critères de validation

| Phase | Travail | Risque backend | Vérification |
| --- | --- | --- | --- |
| Audit | Documents de décision et baseline | Aucun | Les deux `npm run check` réussissent. |
| Routage/SEO | Alias tarifs et landing demandeur d’emploi, sitemap et index Guide | Aucun | Test des routes, métadonnées uniques. |
| Diagnostic | Situation initiale, branche bloquée, résultat prudent et reprise locale | Faible : stockage navigateur seulement | Tests unitaires de l’ordre des étapes et du moteur. |
| Conversion | Événements sans PII et sortie micro-entreprise officielle | Aucun | Tests TypeScript et inspection des appels. |
| Régression | Contrôle final de V3 | Aucun | `npm run check`, puis E2E si exécutable. |

## Éléments explicitement non retenus

- Remplacement de la homepage, du header, du footer ou du dashboard V3 : la version
  canonique possède une intégration visuelle et média plus riche, déjà cohérente.
- Copie des images V4 : V3 propose les mêmes intentions avec variants responsive,
  manifest centralisé et disclosure illustratif.
- Simplifications V4 d’Auth, Notifications et opérations : elles feraient perdre des
  parcours V3 fonctionnels.
- Toute migration ou dépendance V4 : aucune ne résout un besoin que V3 ne couvre pas.
