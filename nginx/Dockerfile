FROM nginx:alpine

# Устанавливаем bash и sed для entrypoint скрипта
RUN apk add --no-cache bash

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем entrypoint скрипт
COPY nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Копируем статические файлы фронтенда
COPY . /usr/share/nginx/html

# Удаляем файлы, которые не нужны в production
RUN rm -rf /usr/share/nginx/html/backend \
           /usr/share/nginx/html/node_modules \
           /usr/share/nginx/html/.git \
           /usr/share/nginx/html/docker-compose.yml \
           /usr/share/nginx/html/nginx.conf \
           /usr/share/nginx/html/nginx

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

