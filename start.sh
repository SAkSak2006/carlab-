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

# Debug: Show current directory and structure
echo "=== DEBUG: Environment Info ==="
echo "Current directory: $(pwd)"
echo "User: $(whoami)"
echo ""

echo "=== DEBUG: /app contents ==="
ls -la /app/ 2>&1 || echo "Cannot list /app/"
echo ""

echo "=== DEBUG: Checking for dist directories ==="
find /app -name "dist" -type d 2>/dev/null || echo "No dist directories found"
echo ""

echo "=== DEBUG: public-site structure ==="
ls -la /app/public-site/ 2>&1 || echo "public-site not found"
echo ""

echo "=== DEBUG: crm structure ==="
ls -la /app/crm/ 2>&1 || echo "crm not found"
echo ""

# Verify build artifacts exist
echo "Verifying build artifacts..."
if [ ! -d "/app/public-site/dist" ]; then
  echo "ERROR: /app/public-site/dist not found!"
else
  echo "✓ /app/public-site/dist exists"
  echo "Contents:"
  ls -la /app/public-site/dist/
fi

if [ ! -d "/app/crm/dist" ]; then
  echo "ERROR: /app/crm/dist not found!"
else
  echo "✓ /app/crm/dist exists"
  echo "Contents:"
  ls -la /app/crm/dist/
fi

# Start Caddy
echo "Starting Caddy web server..."
exec caddy run --config /app/Caddyfile --adapter caddyfile 2>&1
