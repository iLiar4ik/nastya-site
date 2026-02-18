#!/bin/sh
set -e
mkdir -p /app/data /app/data/uploads
chmod -R 777 /app/data
# Docker: server.js в /app. Nixpacks: в .next/standalone/
if [ -f server.js ]; then
  exec node server.js
else
  exec node .next/standalone/server.js
fi
