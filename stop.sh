#!/bin/bash

# Default port is 3000 if not provided
PORT=${1:-3000}
echo "🔍 Checking for process on port: $PORT"

# Try lsof first
PID=$(lsof -t -i tcp:$PORT)

# If lsof fails, fallback to netstat
if [[ -z "$PID" ]]; then
  PID=$(sudo netstat -tulnp 2>/dev/null | grep ":$PORT" | awk '{print $7}' | cut -d'/' -f1)
fi

# Final check
if [[ -z "$PID" ]]; then
  echo "✅ No process found on port $PORT. Nothing to kill."
  exit 0
fi

# Validate PID is numeric
if [[ "$PID" =~ ^[0-9]+$ ]]; then
  echo "⚠️ Found process with PID: $PID. Attempting to terminate..."
  sudo kill -9 "$PID"

  if [[ $? -eq 0 ]]; then
    echo "✅ Successfully killed process $PID on port $PORT."
  else
    echo "❌ Failed to kill process $PID. You may need elevated permissions."
    exit 1
  fi
else
  echo "❌ Invalid PID detected: $PID"
  exit 1
fi
