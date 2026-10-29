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
- `GET /api/pollutions` renvoie les mesures.
- `GET /api/pollutions/:id` renvoie une mesure par identifiant.

À son premier démarrage, l’API synchronise le modèle Sequelize et insère des
mesures de démonstration si la table est vide.

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

## Déploiement de l’API sur Render

Le `render.yaml` à la racine du dépôt déclare la base PostgreSQL managée et le
service API. Son `rootDir` est adapté à l’emplacement réel du TP
(`tp02/tp02/api`). Le Blueprint injecte `DATABASE_URL` depuis la base créée.
Pour déployer, créez un Blueprint Render à partir du dépôt et appliquez la
configuration.

## Compatibilité du frontend

L’API CNAM retourne des mesures (`ville`, `polluant`, `valeur`, `date`), tandis
que l’interface actuelle du TP utilise des déclarations (`titre`, `type`,
`lieu`, coordonnées). Le backend est intégré et déployable, mais le frontend
reste inchangé et n’est pas encore connecté à ce format d’API.
