1. npm i
2. docker-compose -f docker-compose.dev.yml up --build
3. docker compose exec http-gateway npx mikro-orm migration:create --config=libs/config/src/lib/postgresdb.config.ts
4. docker compose exec http-gateway npx mikro-orm migration:up --config=libs/config/src/lib/postgresdb.config.ts

docker-compose -f docker-compose.dev.yml exec http-gateway npx mikro-orm migration:create --config=libs/config/src/lib/postgresdb.config.ts

docker-compose -f docker-compose.dev.yml exec http-gateway npx mikro-orm migration:up --config=libs/config/src/lib/postgresdb.config.ts
