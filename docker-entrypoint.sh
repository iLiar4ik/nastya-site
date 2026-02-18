#!/bin/sh
set -e
# Volume /app/data при первом запуске принадлежит root — даём права nextjs
mkdir -p /app/data && chown -R nextjs:nodejs /app/data 2>/dev/null || true
exec su-exec nextjs node server.js
