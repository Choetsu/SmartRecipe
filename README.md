# SmartRecipe

Réalisation d'une application web de recherche de recettes de cuisine avec une recommandation intelligente de recettes, tout en explorant des fonctionnalités avancées pouvant être améliorées grâce à l'intelligence artificielle.

## Installation et lancement du projet

### Prérequis

-   Docker
-   Docker-compose
-   NodeJS
-   NPM

### Installation

1. Cloner le projet : `git clone git@github.com:Choetsu/SmartRecipe.git`
2. Se placer dans le dossier du projet : `cd SmartRecipe`
3. Lancer le docker-compose : `docker compose up -d`
4. Créer un fichier `web-variables.env` a la racine du projet et y ajouter les variables d'environnement suivantes :
    - `DATABASE_URL=postgresql://root:postgres@database:5432/app`
    - `JWT_SECRET=secret`
    - `OPENAI_API_KEY=YOUT_OPENAI_API_KEY`
5. Installer les dépendances : `docker compose exec node npm install`
6. Lancer les migrations : `docker compose exec node npm run migrate`

### Lancement du projet

1. Lancez le serveur : `docker compose exec node npm run start`
2. Le serveur de l'API est accessible à l'adresse : `http://localhost:3000`
3. Lancer le client : `cd client && npm install && npm run start`
4. Le client est accessible à l'adresse : `http://localhost:3001`
