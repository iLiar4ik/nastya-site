FROM nginx:alpine

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем статические файлы фронтенда
COPY . /usr/share/nginx/html

# Удаляем файлы, которые не нужны в production
RUN rm -rf /usr/share/nginx/html/backend \
           /usr/share/nginx/html/node_modules \
           /usr/share/nginx/html/.git \
           /usr/share/nginx/html/docker-compose.yml \
           /usr/share/nginx/html/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

