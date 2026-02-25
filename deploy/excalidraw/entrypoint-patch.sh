#!/bin/sh
set -e
WS_URL="${EXCALIDRAW_ROOM_WS_URL:-wss://excalidraw-room.math-nastya.ru}"
echo "Replacing collaboration URL in JS with: $WS_URL"
N=0
for dir in /usr/share/nginx/html /app /var/www/html /app/build; do
  if [ -d "$dir" ]; then
    echo "Checking $dir..."
    for f in $(find "$dir" -type f -name "*.js" 2>/dev/null); do
      if grep -q "oss-collab\.excalidraw\.com" "$f" 2>/dev/null; then
        sed -i "s|https://oss-collab\.excalidraw\.com|$WS_URL|g; s|wss://oss-collab\.excalidraw\.com|$WS_URL|g" "$f"
        N=$((N + 1))
      fi
    done
    if [ -f "$dir/env.json" ]; then
      sed -i "s|\"SOCKET_SERVER_URL\":\"[^\"]*\"|\"SOCKET_SERVER_URL\":\"$WS_URL\"|g" "$dir/env.json"
    fi
  fi
done
if [ $N -eq 0 ]; then
  echo "WARNING: no JS files contained oss-collab in standard dirs. Trying /usr and /app..."
  for f in $(find /usr /app -type f -name "*.js" ! -path "*/node_modules/*" 2>/dev/null); do
    if grep -q "oss-collab\.excalidraw\.com" "$f" 2>/dev/null; then
      sed -i "s|https://oss-collab\.excalidraw\.com|$WS_URL|g; s|wss://oss-collab\.excalidraw\.com|$WS_URL|g" "$f"
      N=$((N + 1))
      echo "Patched: $f"
    fi
  done
fi
SW_STUB='self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",()=>{self.registration.unregister().then(()=>self.clients.claim());});'
for dir in /usr/share/nginx/html /app /var/www/html /app/build; do
  for name in service-worker.js sw.js; do
    if [ -f "$dir/$name" ]; then
      echo "Disabling Service Worker (stub): $dir/$name"
      printf '%s' "$SW_STUB" > "$dir/$name"
    fi
  done
done
for f in $(find /usr/share/nginx/html /app -type f \( -name "service-worker.js" -o -name "sw.js" \) 2>/dev/null); do
  echo "Overwriting SW: $f"
  printf '%s' "$SW_STUB" > "$f"
done
if [ -d /usr/share/nginx/html ]; then
  echo "Force stub to nginx root: service-worker.js and sw.js"
  printf '%s' "$SW_STUB" > /usr/share/nginx/html/service-worker.js
  printf '%s' "$SW_STUB" > /usr/share/nginx/html/sw.js
fi
echo "Creating env.json with SOCKET_SERVER_URL=$WS_URL"
printf '%s' "{\"SOCKET_SERVER_URL\":\"$WS_URL\"}" > /usr/share/nginx/html/env.json
if [ -d /etc/nginx/conf.d ]; then
  echo "Disabling cache for service-worker.js and sw.js so browser gets our stub"
  printf '    location = /service-worker.js {\n      add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";\n      add_header Pragma "no-cache";\n    }\n    location = /sw.js {\n      add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";\n      add_header Pragma "no-cache";\n    }\n' > /tmp/sw-nocache.conf
  if [ -f /etc/nginx/conf.d/default.conf ]; then
    sed -i '/^[[:space:]]*server[[:space:]]*{/r /tmp/sw-nocache.conf' /etc/nginx/conf.d/default.conf
  fi
fi
echo "Patched $N JS file(s). Starting nginx..."
exec nginx -g 'daemon off;'
