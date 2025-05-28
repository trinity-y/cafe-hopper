#!/bin/sh
set -e

echo "Seeding the database..."
node /app/scripts/seed.js

exec "$@"