#!/bin/bash

# Default port is 3000 if not provided
PORT=${1:-3000}
echo "🔍 Checking for process on port: $PORT"

# Try lsof first (with sudo to see other users' processes)
PID=$(sudo lsof -t -i tcp:$PORT 2>/dev/null)

# If lsof fails, fallback to ss
if [[ -z "$PID" ]]; then
  PID=$(sudo ss -ltnp 2>/dev/null | grep ":$PORT" | awk '{print $NF}' | cut -d',' -f2 | cut -d'=' -f2)
fi

# Final check
if [[ -z "$PID" ]]; then
  echo "✅ No process found on port $PORT. Nothing to kill."
  exit 0
fi

# Loop through all PIDs found
for p in $PID; do
  if [[ "$p" =~ ^[0-9]+$ ]]; then
    echo "⚠️ Found process with PID: $p. Attempting to terminate..."
    sudo kill -9 "$p"

    if [[ $? -eq 0 ]]; then
      echo "✅ Successfully killed process $p on port $PORT."
    else
      echo "❌ Failed to kill process $p. You may need elevated permissions."
      exit 1
    fi
  else
    echo "❌ Invalid PID detected: $p"
    exit 1
  fi
done
