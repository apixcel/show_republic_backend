
Create .env file and add all of variable by name form .env.example

Only for the development :

npm install
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml exec http-gateway npx mikro-orm migration:create --config=libs/config/src/lib/postgresdb.config.ts
docker-compose -f docker-compose.dev.yml exec http-gateway npx mikro-orm migration:up --config=libs/config/src/lib/postgresdb.config.ts
docker-compose -f docker-compose.dev.yml up

Production setup :


1. npm install
2. docker-compose up --build
3. docker compose exec http-gateway npx mikro-orm migration:create --config=libs/config/src/lib/postgresdb.config.ts
4. docker compose exec http-gateway npx mikro-orm migration:up --config=libs/config/src/lib/postgresdb.config.ts



