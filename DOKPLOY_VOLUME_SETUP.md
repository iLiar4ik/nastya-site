# Настройка постоянного хранилища для базы данных в Dokploy

## Проблема
После каждого деплоя ученики и данные пропадают, потому что база данных SQLite не сохраняется между деплоями.

## Решение: Настройка Volume в Dokploy

### Вариант 1: Если используете Docker Compose

1. **В настройках проекта Dokploy найдите раздел "Volumes" или "Storage"**

2. **Добавьте volume для `/app/data`:**
   - **Host Path**: `/var/lib/dokploy/volumes/nastya-site-data` (или любой другой путь на сервере)
   - **Container Path**: `/app/data`
   - **Type**: `bind` или `volume`

3. **Или отредактируйте docker-compose.yml напрямую:**
   
   Если Dokploy позволяет редактировать compose файл, убедитесь что там есть:
   ```yaml
   volumes:
     - payload_data:/app/data
   
   volumes:
     payload_data:
   ```

### Вариант 2: Если используете Nixpacks (стандартный деплой)

1. **В настройках приложения в Dokploy:**
   - Перейдите в раздел **"Storage"** или **"Volumes"**
   - Нажмите **"Add Volume"**

2. **Настройте volume:**
   - **Mount Path**: `/app/data`
   - **Volume Name**: `nastya-site-data` (или любое другое имя)
   - **Type**: `Volume` (рекомендуется) или `Bind Mount`

3. **Сохраните настройки и выполните Redeploy**

### Вариант 3: Ручная настройка через SSH (если Dokploy не поддерживает volumes в UI)

1. **Подключитесь к серверу по SSH**

2. **Найдите путь к проекту:**
   ```bash
   # Обычно это что-то вроде:
   cd /etc/dokploy/applications/nastyamath-site-*/code
   # или
   cd /var/lib/dokploy/applications/nastyamath-site-*/
   ```

3. **Создайте директорию для данных:**
   ```bash
   sudo mkdir -p /var/lib/dokploy/volumes/nastya-site-data
   sudo chmod 777 /var/lib/dokploy/volumes/nastya-site-data
   ```

4. **Если используете Docker Compose, отредактируйте docker-compose.yml:**
   ```yaml
   services:
     app:
       volumes:
         - /var/lib/dokploy/volumes/nastya-site-data:/app/data
   ```

5. **Если используете Nixpacks, нужно добавить volume через Docker:**
   ```bash
   # Найдите имя контейнера
   docker ps | grep nastya
   
   # Остановите контейнер
   docker stop <container-name>
   
   # Запустите с volume
   docker run -d \
     --name <container-name> \
     -v /var/lib/dokploy/volumes/nastya-site-data:/app/data \
     ... остальные параметры
   ```

## Проверка

После настройки volume:

1. **Создайте несколько учеников в админке**

2. **Выполните Redeploy приложения**

3. **Проверьте, что ученики остались:**
   - Откройте админку
   - Перейдите в раздел "Ученики"
   - Ученики должны быть на месте

4. **Проверьте volume через SSH:**
   ```bash
   ls -la /var/lib/dokploy/volumes/nastya-site-data/
   # Должен быть файл payload.db
   ```

## Важно

- **Volume должен быть настроен ДО создания данных**, иначе при первом деплое данные будут потеряны
- **Делайте бэкапы** базы данных перед важными обновлениями
- **Путь `/app/data` должен быть доступен для записи** (права 777 или запуск от root)

## Бэкап базы данных

Для создания бэкапа:
```bash
# На сервере
docker exec nastya-site-app cp /app/data/payload.db /app/data/payload.db.backup
# или через volume
cp /var/lib/dokploy/volumes/nastya-site-data/payload.db /var/lib/dokploy/volumes/nastya-site-data/payload.db.backup
```
