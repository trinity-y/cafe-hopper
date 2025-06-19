#!/bin/bash
set -e

# load backend environment
if [ -f .env ]; then
  echo "loading backend environment from .env"
  export $(grep -v '^#' .env | xargs)
else
  echo "ERROR: no .env file found in root."
  exit 1
fi

# wait for postgres
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h "$POSTGRES_HOST" -p "$POSTGRES_PORT"; do
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 2
done
echo "postgres is ready"

# MAYBE seed the db
read -p "do you want to reseed the DB? (y/n) " answer
if [[ $answer == "y" ]]; then
  echo "re-seeding db"
  node ./typescript-backend/scripts/seed.js
else
  echo "skipping seed"
fi

# build + start backend
echo "starting backend"
cd typescript-backend
npm install
npm run build
npm start &
cd ..

# start frontend
echo "starting frontend"
cd react-frontend
npm install
npm start &
cd ..

echo "successful"
