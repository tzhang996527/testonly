#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Kill any existing instances on our ports
kill_port() {
  local pid
  pid=$(lsof -ti ":$1" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "Stopping existing process on port $1 (PID $pid)..."
    kill "$pid" 2>/dev/null || true
    sleep 1
  fi
}

kill_port 3001
kill_port 5173

# Start backend, tee output to terminal
echo "▶ Starting backend..."
node server/index.js 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
for i in $(seq 1 10); do
  if curl -sf http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend ready  → http://localhost:3001"
    break
  fi
  sleep 0.5
  if [ "$i" -eq 10 ]; then
    echo "❌ Backend failed to start. Check errors above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
done

# Start frontend
echo "▶ Starting frontend..."
npm run dev 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready
for i in $(seq 1 20); do
  if curl -sf http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend ready → http://localhost:5173"
    break
  fi
  sleep 0.5
  if [ "$i" -eq 20 ]; then
    echo "❌ Frontend failed to start. Check errors above."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Backend  → http://localhost:3001"
echo "  Frontend → http://localhost:5173"
echo "  Press Ctrl+C to stop both."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# Keep script alive and forward output
wait $BACKEND_PID $FRONTEND_PID
