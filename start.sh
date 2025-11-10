#!/bin/sh
set -e

echo "Starting Ilialox services..."

# Start backend in background
echo "Starting backend API..."
cd /app/backend && npm start &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in $(seq 1 30); do
  if curl -f http://localhost:5000/health 2>/dev/null; then
    echo "Backend is ready!"
    break
  fi
  echo "Waiting for backend... ($i/30)"
  sleep 2
done

# Start Caddy
echo "Starting Caddy web server..."
exec caddy run --config /app/Caddyfile --adapter caddyfile 2>&1
