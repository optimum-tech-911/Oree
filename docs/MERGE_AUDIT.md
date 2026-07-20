# Audit de fusion V3 / V4

Date : 20 juillet 2026. Dépôt canonique : `oree-company-platform-v3`.

## Périmètre et méthode

La référence V4 est présente localement dans `oree-company-platform-v4/` (et non dans
`_merge_reference/` comme l’indique le brief). Elle est traitée uniquement comme une
source de comparaison : elle n’est ni importée par Vite, ni utilisée comme application
déployable. Aucun fichier d’environnement, lockfile, migration, fonction Edge ou
configuration Cloudflare n’est repris automatiquement.

Les deux applications ont été contrôlées avant toute modification :

| Base | Commande | Résultat |
| --- | --- | --- |
| V3 canonique | `npm run check` | ESLint, TypeScript, 6 tests et build : réussis ; index Guide : 1 400 entrées / 71 fichiers. |
| Référence V4 | `npm run check` | Vérification de 44 assets, ESLint, TypeScript, 8 tests et build : réussis ; index Guide : 1 698 entrées / 71 fichiers. |

Deux changements locaux préexistants sont conservés sans écrasement :
`app/components/marketing/DynamicHeroCarousel.tsx` corrige le défilement des onglets
mobiles et `tests/e2e/smoke.spec.ts` le couvre.

## Conclusions

- **V3 reste l’autorité** pour Supabase, Auth, RLS, Storage, Edge Functions,
  configuration de déploiement, mode démonstration, images optimisées, navigation app
  et opérations, récupération de mot de passe et écrans Notifications/Aide/Profil.
- **V4 est retenue comme référence sélective** pour le démarrage du diagnostic par la
  situation, la branche dossier bloqué, la route demandeur d’emploi, l’alias SEO
  `/tarifs`, les événements de conversion et le filtrage de l’intention
  micro-entreprise.
- **Le système visuel V3 est conservé** : il applique déjà exactement la palette cible,
  Onest/Newsreader, le header flottant, les composants média art-directed et les
  variantes mobile AVIF/WebP. Les assets WebP V4 sont donc rejetés pour éviter des
  doublons moins optimisés.

## Analyse de sûreté

Les migrations V3 et V4 ont les mêmes familles `0001` à `0004`. V3 contient en plus la
surface applicative et les protections opérationnelles actuellement utilisées. Aucun
changement de table, enum, policy RLS, bucket, trigger ou Edge Function n’est nécessaire
pour les améliorations retenues : elles consomment les contrats frontend existants. Les
événements analytics ne contiennent ni e-mail, ni téléphone, ni contenu libre.

La référence V4 ne doit pas être publiée, installée ou fusionnée en bloc. Elle demeure
un dossier de travail local à conserver jusqu’à validation complète de la fusion.
