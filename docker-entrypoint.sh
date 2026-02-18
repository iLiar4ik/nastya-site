#!/bin/sh
set -e
# Миграции выполняет SQLite-адаптер при первом подключении (connect)
exec node server.js
