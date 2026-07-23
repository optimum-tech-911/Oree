# Rapport final de fusion V3 / V4

Date : 20 juillet 2026. Application livrable : dépôt V3 canonique uniquement.

## Résultat

V4 a servi de référence de contenu, conversion et UX. Les améliorations ont été
réimplémentées dans l’architecture V3 sans copier une seconde application, sans nouveau
backend et sans affaiblir Supabase, RLS, le mode démonstration ou le système visuel.

## Apports intégrés

- accueil et pages d’acquisition reconstruits autour de l’intention, de la preuve et de
  la prochaine action ;
- présentation transparente du périmètre, des honoraires, frais légaux et coûts tiers ;
- diagnostic enrichi pour les projets solo, à plusieurs, salariés, demandeurs d’emploi,
  micro-entrepreneurs et dossiers bloqués ;
- soumission de lead atomique, consentement et attribution persistés, idempotence,
  honeypot, rate limiting serveur et revendication sécurisée après authentification ;
- espace client entièrement relié aux projets, documents, fondateurs, tâches, messages,
  rendez-vous, profils et préférences ;
- espace opérations relié aux leads, projets, attributions, documents, rendez-vous,
  équipe, messagerie et audit ;
- mutations sensibles via RPC contrôlées et stockage documentaire privé ;
- politiques RLS normalisées pour le planificateur et suppression des doubles politiques
  permissives de lecture ;
- métadonnées, consentement analytics, CTA mobile et contenus juridiques renforcés.

## Supabase déployé

Le projet distant `sksydcdkliuisaahysya` (`oree`) contient les migrations `0001` à `0009`. Les trois fonctions Edge
sont actives : la soumission publique de lead valide elle-même la requête ; les fonctions
de revendication et de création de projet exigent un JWT. Le lint distant ne remonte
aucune erreur de schéma.

Les avertissements génériques portant sur des fonctions `SECURITY DEFINER` ne doivent
pas être interprétés comme une permission ouverte : chaque RPC exposée révoque `public`,
limite son exécution au rôle prévu, fixe son `search_path` et contrôle l’identité, le rôle
ou l’appartenance avant mutation. Ces fonctions sont nécessaires pour effectuer des
transactions atomiques sans donner au navigateur des droits de table plus larges.

## Vérifications

| Vérification | Résultat |
| --- | --- |
| ESLint | Réussi |
| TypeScript strict | Réussi |
| Vitest | 25 / 25 |
| Index du Guide | 1 673 entrées / 84 fichiers |
| Build production Vite | Réussi |
| Supabase DB lint distant | Aucune erreur |
| Historique des migrations | `0001` à `0009` synchronisées |
| Edge Functions | 3 actives |

Le runtime de navigateur intégré n’était pas disponible. Aucune nouvelle inspection
visuelle manuelle n’est donc revendiquée. Les parcours authentifiés distants ne pourront
être testés de bout en bout qu’après création d’un compte réel et promotion contrôlée du
premier administrateur.

## Éléments volontairement non simulés

- aucun faux conseiller, témoignage, partenaire, nombre de notifications ou délai ;
- aucune invitation externe avant branchement d’un fournisseur e-mail sécurisé ;
- aucune synchronisation avec un calendrier tiers avant choix du fournisseur ;
- aucune donnée analytique publicitaire avant configuration et consentement ;
- aucune promotion administrateur depuis un profil éditable.

## Prérequis avant mise en production publique

1. fournir le domaine final et les URLs Auth autorisées ;
2. choisir le fournisseur d’e-mail et l’adresse expéditrice ;
3. confirmer CRM, calendrier, GTM/GA4/Ads le cas échéant ;
4. valider identité juridique, mentions, coordonnées, offres, tarifs et politique de
   confidentialité ;
5. créer le premier compte équipe et l’attribuer au rôle `admin` côté serveur.

## Éléments V4 rejetés

- remplacement complet de V3 ou coexistence de deux produits ;
- second backend ou responsabilités dupliquées sur Cloudflare ;
- dépendances, lockfile ou migrations copiés sans nécessité ;
- promesses, preuves sociales, chiffres, délais ou écrans fictifs ;
- couleurs, polices, gradients et décorations incompatibles avec le système V3.
