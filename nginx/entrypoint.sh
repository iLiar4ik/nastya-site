#!/bin/bash

# Генерируем config.js из переменной окружения API_BASE_URL
# Если переменная не установлена, используем относительный путь /api
API_URL=${API_BASE_URL:-"/api"}

cat > /usr/share/nginx/html/config.js <<EOF
// Автоматически сгенерированный файл конфигурации
window.API_BASE_URL = '${API_URL}';
EOF

echo "Generated config.js with API_BASE_URL=${API_URL}"

# Если указан BACKEND_URL, обновляем nginx.conf для проксирования
if [ -n "$BACKEND_URL" ]; then
    # Заменяем backend:3000 на значение из переменной окружения
    sed -i "s|http://backend:3000|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf
    echo "Updated nginx.conf with BACKEND_URL=${BACKEND_URL}"
fi

# Запускаем nginx
exec nginx -g "daemon off;"

