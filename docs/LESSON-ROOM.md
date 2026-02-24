# Комната урока: LiveKit + Excalidraw

Уроки идут через **LiveKit** (видео/звук) и **Excalidraw** (доска). В **Environment** приложения nastya-site задайте:

| Переменная | Описание |
|------------|----------|
| `LIVEKIT_URL` | URL сервера LiveKit, например `wss://livekit.ваш-домен.ru` |
| `LIVEKIT_API_KEY` | API Key из настроек LiveKit |
| `LIVEKIT_API_SECRET` | API Secret из настроек LiveKit |
| `NEXT_PUBLIC_EXCALIDRAW_URL` | Публичный URL Excalidraw, например `https://excalidraw.ваш-домен.ru` |
| `NEXT_PUBLIC_EXCALIDRAW_ROOM_WS_URL` | (необязательно) URL сервера комнат доски, например `wss://excalidraw-room.ваш-домен.ru`. Если не задан, подставляется из домена Excalidraw (excalidraw. → excalidraw-room.). На странице комнаты этот адрес показывается под заголовком доски. |

Комната LiveKit одна на ученика: имя `nastya-lesson-{id}`. Комната **доски Excalidraw** задаётся сервером и содержит дату: `nastya-lesson-{id}-YYYYMMDD` — одна комната на день, чтобы у учителя и ученика была одна и та же доска и каждый день начинался с пустой. После **Redeploy** кнопка «Войти в урок» откроет видеозвонок (LiveKit) и доску (Excalidraw).

**Почему данные на доске не пропадают после очистки Application?** Содержимое доски хранится **на сервере** (excalidraw-room / хранилище), а не только в браузере. Очистка кэша и данных сайта в браузере не удаляет то, что уже сохранено в комнате. Поэтому мы используем отдельную комнату на день — завтра откроется новая комната с пустой доской.

**LiveKit работает, а Excalidraw — нет (рисунки не синхронизируются, «разные доски»):** Учитель и ученик должны получать **одно и то же имя комнаты доски** из API (оно показывается под доской, например `nastya-lesson-5-20260224`). Если комната одна, но синхронизации всё равно нет, почти всегда мешает **CORS**: сервер комнат отдаёт `Access-Control-Allow-Origin: *` вместе с credentials, и браузер блокирует ответ. Нужно, чтобы перед excalidraw-room стоял nginx-прокси из нашего compose (сервис `excalidraw-room`), который подменяет заголовок на ваш origin (см. раздел про CORS ниже). В DevTools → Network откройте любой запрос к `excalidraw-room.math-nastya.ru/socket.io/` → вкладка Headers → Response Headers: должно быть `access-control-allow-origin: https://excalidraw.math-nastya.ru` (или ваш домен), **не** `*`. Если там звёздочка — трафик не идёт через наш прокси или прокси не задеплоен; задеплойте приложение Excalidraw заново и привяжите домен excalidraw-room к сервису **excalidraw-room** (nginx).

**Если в Network вообще нет запросов к excalidraw-room (нет socket.io к вашему домену):** Значит доска в iframe грузит **старый бандл**, в котором зашит адрес oss-collab.excalidraw.com — запросы уходят туда (или блокируются). Частая причина — **Service Worker** (Workbox): он отдаёт закэшированные чанки, и подмена URL в файлах на сервере до браузера не доходит. В compose при старте контейнера **service-worker.js** подменяется на заглушку (при активации снимает регистрацию SW), а для этого URL в nginx отключают кэш (Cache-Control: no-store), чтобы браузер не получал 304 и всегда забирал заглушку. После деплоя откройте урок в **режиме инкогнито** или в другом браузере — должны появиться запросы к excalidraw-room. В логах контейнера проверьте «Patched N JS file(s)» и «Disabling cache for service-worker.js».

---

## Сервер комнат Excalidraw (синхронизация доски между устройствами)

В Dokploy нет шаблона для **сервера комнат**. Есть два пути: **готовый Docker Compose** (всё в одном, свои комнаты из коробки) или только room вручную.

### Вариант A: Готовый Docker Compose для Dokploy (рекомендуется)

**Файлы:** `deploy/excalidraw/docker-compose.yml`, `deploy/excalidraw/env.example`.

1. **Новое приложение** → тип **Docker Compose**. Источник — репозиторий nastya-site. **Путь к compose:** укажите именно **`deploy/excalidraw/docker-compose.yml`** (с `deploy` без точки в начале). Если указать `.deploy/excalidraw/...`, папки в репо нет и деплой упадёт с «no such file or directory».
2. **Environment:** `EXCALIDRAW_ROOM_WS_URL=wss://excalidraw-room.ваш-домен.ru`, `EXCALIDRAW_STORAGE_URL=https://excalidraw-api.ваш-домен.ru`.
3. **Domains:** excalidraw → 80, excalidraw-room → 80 (трафик идёт в nginx-прокси с исправлением CORS), excalidraw-storage-backend → 8080; redis не открывать.
4. **DNS (Beget):** A-записи для `excalidraw`, `excalidraw-room`, `excalidraw-api` на IP сервера. Включите SSL, Deploy.

В nastya-site задайте `NEXT_PUBLIC_EXCALIDRAW_URL=https://excalidraw.ваш-домен.ru`.

**Если WebSocket комнаты не появляется (в DevTools → Network → WS пусто или подключается к oss-collab.excalidraw.com):**
- В образе Excalidraw URL коллаборации часто **зашит в JS** при сборке, поэтому в `docker-compose.yml` при старте контейнера выполняется замена `oss-collab.excalidraw.com` на ваш `EXCALIDRAW_ROOM_WS_URL` в собранных `.js` файлах. После деплоя сделайте **жёсткое обновление** (Ctrl+Shift+R) или откройте доску в режиме инкогнито.
- **Почему в обычном режиме (не инкогнито) всё равно подключается к серверу Excalidraw?** Excalidraw может регистрировать **Service Worker** — он кэширует старые JS и отдаёт их даже при Ctrl+Shift+R и очистке истории. Нужно удалить кэш именно для сайта доски: откройте **https://excalidraw.ваш-домен.ru** в отдельной вкладке → F12 → вкладка **Application** (Chrome) / **Storage** (Firefox) → **Service Workers** → нажмите **Unregister** для этого сайта; затем **Storage** → **Clear site data** для этого же сайта. После этого закройте вкладку и снова откройте доску (например, из урока).
- Откройте в **режиме инкогнито** `https://excalidraw.ваш-домен.ru/env.json` — в ответе должен быть `SOCKET_SERVER_URL` с вашим `wss://excalidraw-room...`. Если конфиг верный, но wss всё равно нет: открывайте доску **с комнатой в URL**, например `https://excalidraw.ваш-домен.ru/#room=test` (без `#room=...` приложение не подключается к серверу комнат). Затем откройте DevTools → Console и посмотрите, нет ли ошибок при подключении к сокету; проверьте, что сервер комнат доступен (например, в браузере `https://excalidraw-room.ваш-домен.ru` — часто отдаёт «OK»).
- Если в env.json пусто или другой адрес — переменные не попали в контейнер. В compose прописаны значения по умолчанию для math-nastya.ru; после пуша и нового деплоя они подхватятся даже без Environment в Dokploy.

**Если комната открывается, но синхронизации между учителем и учеником нет:**
- Убедитесь, что оба открыли **один и тот же URL комнаты** (с `#room=nastya-lesson-{id}`). Ссылка «Войти в урок» уже подставляет комнату; не меняйте её вручную.
- В логах контейнера **excalidraw-frontend** (Dokploy → приложение → логи) должна быть строка вида `Patched N JS file(s)`. Если **N = 0**, замена URL в бандле не сработала — в DevTools → Network → WS всё ещё будет подключение к `oss-collab.excalidraw.com`. Сделайте жёсткое обновление (Ctrl+Shift+R) или откройте доску в инкогнито.
- В DevTools → Network → вкладка **WS**: при открытой комнате должно быть подключение к **wss://excalidraw-room.ваш-домен.ru**. Если подключается к oss-collab, очистите кэш сайта Excalidraw и перезапустите контейнер excalidraw. В обычном режиме (не инкогнито) часто мешает **Service Worker** — см. выше (Application → Service Workers → Unregister и Clear site data для excalidraw.ваш-домен.ru).

**Если запросы к excalidraw-room идут (видно в Network), но многие помечены как неудачные (красный крестик) при коде 200 OK и синхронизации нет:**  
Сервер комнат отдаёт **CORS**: `Access-Control-Allow-Origin: *` и `Access-Control-Allow-Credentials: true`. По спецификации CORS такая комбинация **недопустима** — браузер блокирует ответ, поэтому в DevTools виден 200 OK, но запрос считается failed и синхронизация не работает.  
В compose перед сервером комнат добавлен **nginx-прокси** (сервис `excalidraw-room`), который подменяет заголовок на конкретный origin вашего фронта (`https://excalidraw.math-nastya.ru`). Домен в Dokploy по-прежнему указывайте на сервис **excalidraw-room** (трафик идёт в прокси, прокси — в excalidraw-room-backend). Если ваш фронт Excalidraw открывается по другому адресу, отредактируйте в репозитории файл `deploy/excalidraw/excalidraw-room-proxy.conf`: в строке `add_header Access-Control-Allow-Origin` укажите ваш origin (например `https://excalidraw.ваш-домен.ru`) и задеплойте заново.

**Если запросы к excalidraw-room идут, но падают с 502/504 или по таймауту (не 200 OK):**  
Тогда причина в прокси перед контейнером (Dokploy/Traefik):
- Должна поддерживаться **апгрейд до WebSocket**: заголовки `Upgrade: websocket`, `Connection: Upgrade` должны проксироваться на контейнер excalidraw-room.
- **Таймауты** не должны быть слишком короткими: long-polling и WebSocket держат соединение открытым; если прокси режет его раньше времени (например, 60 с), часть запросов будет с 502/504 или «failed».

Что сделать: в панели Dokploy для приложения Excalidraw проверьте, что у домена **excalidraw-room** включена поддержка WebSocket (если есть такая опция). Для Traefik обычно достаточно аннотаций для WebSocket; если прокси свой — добавьте для пути `/socket.io/` передачу `Upgrade` и `Connection` и увеличьте `proxy_read_timeout` (например, до 3600 с). В DevTools → Network откройте один из **неудачных** запросов к socket.io и посмотрите код ответа (например, 502, 504, net::ERR_EMPTY_RESPONSE) — по нему проще понять, обрыв по таймауту или ошибка прокси/бэкенда.

### Вариант B: Только сервер комнат (уже есть фронтенд Excalidraw)

1. **Docker Image** → `excalidraw/excalidraw-room:latest`, порт **80**, домен `excalidraw-room.ваш-домен.ru`, SSL.
2. В настройках текущего Excalidraw — переменная **`SOCKET_SERVER_URL`** (или `REACT_APP_WS_SERVER_URL`): `wss://excalidraw-room.ваш-домен.ru`, Redeploy. Если переменной нет, используйте вариант A (образ [kiliandeca/excalidraw](https://hub.docker.com/r/kiliandeca/excalidraw) с настройкой через env).

---

## Доска Excalidraw: изображения и PDF

На доске можно вставлять **изображения**: Ctrl+V (Cmd+V) или меню «добавить изображение». **PDF** — конвертируйте страницы в картинки (PNG/JPEG) и вставьте на доску или добавьте файлом через меню.
