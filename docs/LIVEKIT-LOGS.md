# Логи LiveKit: что означают сообщения

Краткая расшифровка типичных записей в логах сервера LiveKit (в т.ч. при деплое через Dokploy).

---

## Старт сервера

- **`connecting to redis`** — подключение к Redis, всё в порядке.
- **`starting WHIP server`** — поднят WHIP‑сервер (веб‑стриминг в комнаты).
- **`using external IPs`** — сервер знает свой внешний IP для WebRTC.

---

## Предупреждения при старте (WARN)

### UDP receive buffer is too small

```
UDP receive buffer is too small for a production set-up
current: 425984, suggested: 5000000
```

Рекомендация по настройке ОС: для большого числа участников в продакшене лучше увеличить буфер. На работу одного-двух звонков это обычно не влияет. При желании можно задать на хосте, например: `sysctl -w net.core.rmem_max=5000000` (и перезапустить контейнер).

### rtmp / whip / url input requirement too low

```
rtmp input requirement too low  (config value: 0, recommended: 2)
whip input requirement too low ...
url input requirement too low ...
```

Это настройки **входящего стриминга** (Ingress): RTMP, WHIP, URL. Если вы не пускаете в комнаты поток из OBS/внешнего источника по RTMP/WHIP/URL, а только браузерный звонок через наш сайт — эти предупреждения можно не трогать. Они говорят лишь о том, что лимиты на Ingress выставлены в 0 (по сути, ingress не задействован).

---

## failed retrieving ingress info

Примеры:

```
failed retrieving ingress info  streamKey: ""  error: "request needs to specify either IngressId or StreamKey"
failed retrieving ingress info  streamKey: "graphql"  error: "ingress does not exist"
failed retrieving ingress info  streamKey: "api"  error: "ingress does not exist"
```

- Пустой `streamKey` — кто‑то дергает API ingress без ключа (скрипт, бот, неверный клиент).
- `streamKey: "graphql"`, `"api"`, `"gql"` — похоже на **сканирование** портов/путей: подставляют типичные имена, ingress правильно отвечает «такого нет».

Если вы не используете Ingress (стрим в комнату по RTMP/WHIP по ключу), эти сообщения можно игнорировать. На видеозвонки через браузер они не влияют.

---

## RTMP: Failed to handshake / closing ingress RTMP session

```
Server closed by error: Err = unexpected EOF
Failed to handshake
...
closing ingress RTMP session
```

К порту **1935 (RTMP)** приходит подключение, но рукопожатие RTMP не завершается: обрыв связи, неверный URL в OBS, или не RTMP‑трафик (например, сканер). Если вы не подключаете OBS/внешний энкодер по RTMP к LiveKit — это почти наверняка мусорный трафик из интернета. Безопасно игнорировать.

---

## Итог

| Сообщение | Действие |
|-----------|----------|
| Redis, WHIP, external IPs | Всё ок |
| UDP buffer / rtmp whip url requirement | По желанию настроить для продакшена; для браузерных звонков не обязательно |
| failed retrieving ingress info (пустой или graphql/api/gql) | Сканеры/боты; можно не реагировать |
| RTMP Failed to handshake | Подключения к RTMP без нормального handshake; если RTMP не используете — игнорировать |

Видеозвонки в уроке идут через браузер (WebRTC), а не через RTMP/Ingress, поэтому перечисленные предупреждения и «failed» по ingress/RTMP на работу звонков не влияют.
