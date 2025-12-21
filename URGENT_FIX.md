# СРОЧНО: Исправление проблемы с деплоем

## Главная проблема

Dokploy все еще клонирует **старый репозиторий** `nastya-tutor` вместо `nastya-site`!

## Что нужно сделать ПРЯМО СЕЙЧАС:

### 1. Исправьте URL репозитория в Dokploy

В настройках проекта Dokploy:

**Измените Repository URL с:**
```
https://github.com/iLiar4ik/nastya-tutor.git
```

**На:**
```
https://github.com/iLiar4ik/nastya-site.git
```

Это критично! Без этого Dokploy будет использовать старый код.

### 2. Проверьте переменные окружения

Убедитесь, что в Dokploy добавлены:

```
APP_PORT=8000
NEXTAUTH_URL=http://ваш-ip:8000
POSTGRES_PASSWORD=_Vozolopatikin16099891
NEXTAUTH_SECRET=xwsdo1wZhTM4LU2aZ4dg10DERC37+D/Jk7SF/HXgPcc
POSTGRES_USER=nastya_user
POSTGRES_DB=nastya_site
NODE_ENV=production
COMPOSE_PROJECT_NAME=nastyarepetitor-postgres-xv1lrm
```

### 3. После исправления URL репозитория

1. Сохраните настройки
2. Нажмите **"Redeploy"** или **"Deploy"**
3. Дождитесь завершения

## Почему это важно

Старый репозиторий `nastya-tutor` содержит старую версию кода, которая:
- Использует порт 3000 по умолчанию
- Не имеет обновлений для порта 8000
- Может содержать другие проблемы

Новый репозиторий `nastya-site` содержит:
- Обновленный код с поддержкой порта 8000
- Правильную конфигурацию docker-compose
- Все последние исправления

## После успешного деплоя

Создайте первого пользователя:

```bash
docker-compose exec app node create-teacher.js
```

---

**ВАЖНО:** Исправьте URL репозитория ПЕРЕД следующим деплоем!

