# TP02 — Application Pollution

Ce projet contient l’application Angular du TP et l’API pédagogique CNAM
(Node.js, Express, TypeScript, Sequelize et PostgreSQL) dans `api/`.

## Structure

```text
├── api/                 # API Node.js / TypeScript / Express / Sequelize
│   └── src/
│       ├── config.ts
│       ├── controllers/
│       ├── models/
│       └── routes/
├── public/              # Ressources statiques Angular
└── src/                 # Application Angular
```

## Démarrage local

Prérequis : Node.js 22.22.3 et npm (version également configurée pour Render).

1. Démarrez PostgreSQL et configurez l’API. Depuis le dossier `api` :

```powershell
npm ci
Copy-Item .env.example .env
```

Renseignez `DATABASE_URL` dans `api/.env`, ou définissez `DB_HOST`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD` et `DB_NAME`. Le fichier `.env` est ignoré par Git.
Puis démarrez le backend :

```powershell
npm run dev
```

L’API écoute sur `http://localhost:3000` :

- `GET /health` vérifie que le serveur fonctionne.
- `POST /api/users` crée un utilisateur; `GET /api/users` renvoie la liste.
- `GET /api/pollutions` et `GET /api/pollutions/:id` listent les déclarations
  et affichent leur détail.
- `POST /api/pollutions` crée une déclaration.
- `PUT /api/pollutions/:id` modifie une déclaration.
- `DELETE /api/pollutions/:id` supprime une déclaration.
- `GET /api/mesures` et `GET /api/mesures/:id` gardent l'accès aux mesures
  pédagogiques historiques (`ville`, `valeur`, `polluant`, `date`).

À son premier démarrage, l’API synchronise les modèles Sequelize et insère des
mesures de démonstration si la table est vide.

La création utilisateur utilise `{ "name", "email", "password" }`. Les
adresses e-mail sont uniques et les mots de passe sont stockés sous forme de
hash; ils ne sont jamais inclus dans la réponse de l'API. Les erreurs de
validation renvoient `400`, les adresses déjà utilisées `409` et les
identifiants de pollution inconnus `404`.

Pour tester la route depuis PowerShell :

```powershell
Invoke-RestMethod http://localhost:3000/api/pollutions
```

Le formulaire Angular utilise `/api/pollutions`; chaque déclaration
(`titre`, `type`, `description`, `date`, `lieu`, `latitude`, `longitude`,
`photo`) est stockée dans la table PostgreSQL `signalement`. La liste et la
création des utilisateurs passent par `/api/users` et la table `users`. Ces
tables sont créées au démarrage sans supprimer les mesures existantes dans
`pollution`.

2. Dans un autre terminal, depuis la racine du projet Angular :

```powershell
npm ci
npm start
```

L’application s’ouvre sur `http://localhost:4200`.

## Tests et compilation

Depuis la racine Angular :

```powershell
npm test -- --watch=false
npm run build
```

Pour compiler le backend :

```powershell
Set-Location api
npm run build
```

## Déploiement sur Render

Le `render.yaml` de ce dossier déclare trois ressources : PostgreSQL, l’API
Node.js et le site Angular statique. Les `rootDir` du Blueprint sont définis
depuis la racine du dépôt : `tp02/tp02/api` pour l’API et `tp02/tp02` pour le
site, publié depuis `dist/tp02/browser`. Créez un Blueprint Render à partir du
dépôt et appliquez la configuration.

## Compatibilité du frontend

En production, le frontend utilise l’API Render définie dans
`src/environments/environment.production.ts`. La création et la liste des
utilisateurs ainsi que le CRUD des pollutions passent par des services Angular
et l’API PostgreSQL.
