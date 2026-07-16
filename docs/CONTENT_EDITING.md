# Modifier les contenus

## Marque

`app/config/brand.ts`

Remplacer nom, descripteur, email, téléphone, adresse et raison sociale.

## Pages Google

`app/content/landingPages.ts`

Chaque entrée définit : titre, promesse, bénéfices, CTA, FAQ et intention initiale.

## Connaissance du Guide

`app/content/knowledge.ts`

Ajouter une entrée pour toute nouvelle action importante. Le build complète automatiquement l'index.

## Formes juridiques

`app/data/legalForms.ts`

Les explications doivent être validées et datées. Éviter des conclusions universelles.

## Diagnostic

- choix : `app/features/diagnostic/config.ts`
- règles : `app/features/diagnostic/engine.ts`

Toute évolution majeure nécessite une nouvelle version lors du passage en base de données.

## Données de démonstration

`app/data/mock.ts`

Ne pas confondre ces données avec de vrais témoignages ou dossiers.
