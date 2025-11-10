#!/bin/sh
set -e

echo "Starting Car Lab services..."

# Run Prisma migrations
echo "Running Prisma migrations..."
cd /app/backend
npx prisma generate
npx prisma migrate deploy
echo "Migrations completed!"

# Start backend in background
echo "Starting backend API..."
cd /app/backend && npm start &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
sleep 3
if curl -f http://localhost:5000/health 2>/dev/null; then
  echo "Backend is ready!"
else
  echo "Warning: Backend health check failed, but continuing..."
fi

# Start Caddy
echo "Starting Caddy web server..."
exec caddy run --config /app/Caddyfile --adapter caddyfile 2>&1
