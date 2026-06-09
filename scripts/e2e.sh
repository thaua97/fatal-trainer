#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/../fatal-trainer-backend"

stop_port() {
  local port="$1"
  local pid
  pid="$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pid" ]]; then
    kill $pid 2>/dev/null || true
    sleep 1
  fi
}

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "Starting PostgreSQL..."
cd "$BACKEND"
docker compose up -d

echo "Preparing database..."
pnpm db:push
pnpm db:seed

echo "Stopping existing dev servers on ports 3000 and 3333..."
stop_port 3333
stop_port 3000

echo "Starting backend API..."
pnpm dev &
BACKEND_PID=$!

echo "Starting Nuxt frontend..."
cd "$ROOT"
export NUXT_E2E=true
export NUXT_PUBLIC_USE_MOCK_API=false
export NUXT_PUBLIC_API_BASE_URL=/api
pnpm dev &
FRONTEND_PID=$!

echo "Waiting for servers..."
pnpm exec wait-on \
  http://localhost:3333/api/personal-trainers \
  http://localhost:3000/personal-trainers \
  -t 120000

echo "Running Cypress..."
pnpm exec cypress run
