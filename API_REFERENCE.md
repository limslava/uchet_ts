# Справочник API Uchet_TS

## 🔐 Аутентификация
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/me` - Информация о текущем пользователе
- `POST /api/auth/:userId/location` - Выбор локации

## 🚗 Управление актами приёмки
- `POST /vehicle-acts` - Создание акта (с загрузкой фото)
- `GET /vehicle-acts` - Список всех актов
- `GET /vehicle-acts/:id` - Акт по ID
- `POST /vehicle-acts/:id/issue` - ❌ Выдача ТС (404 ошибка)
- `GET /vehicle-acts/:id/print` - ❌ Печать акта (не реализовано)

## 📊 Справочники
- `GET /api/dictionaries/directions` - Направления перевозок
- `GET /api/dictionaries/transport-methods` - Способы перевозки
- `GET /api/car-brands` - Марки автомобилей
- `GET /api/car-brands/:id/models` - Модели по марке

## 👥 Управление пользователями (Admin)
- `GET /api/admin/users` - Список пользователей
- `POST /api/admin/users` - Создание пользователя
- `PUT /api/admin/users/:id` - Обновление пользователя

## ⚠️ Проблемные эндпоинты
### Критические:
- `POST /vehicle-acts/:id/issue` - **404 Not Found**
- `GET /vehicle-acts/:id/print` - **404 Not Found**
- `GET /vehicle-acts/:id/print-contract` - **404 Not Found**

### Известные проблемы:
- `PUT /api/admin/vehicle-acts/:id` - **500 Internal Server Error**

## 🛡️ Безопасность
- Все защищенные endpoints требуют JWT токен
- Валидация входных данных
- Защита от SQL-инъекций через Prisma
- Ролевая модель доступа

**Версия API:** 2.1.0 | **Обновлено:** 2025-09-14

## 🚢 Управление отгрузкой контейнеров
- `POST /vehicle-acts/:id/issue` - Выдача ТС (тип CONTAINER)
- `GET /api/admin/dictionaries/containers` - Список контейнеров
- `POST /api/admin/dictionaries/containers` - Создание контейнера

# Справочник API Uchet_TS

## 🔐 Аутентификация
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/me` - Информация о текущем пользователе
- `POST /api/auth/:userId/location` - Выбор локации

## 🚗 Управление актами приёмки
- `POST /vehicle-acts` - Создание акта (с загрузкой фото)
- `GET /vehicle-acts` - Список всех актов  
- `GET /vehicle-acts/:id` - Акт по ID
- `POST /vehicle-acts/:id/issue` - ✅ Выдача ТС (исправлено)
- `GET /vehicle-acts/:id/print` - ✅ Печать акта (реализовано)

## 📊 Справочники
- `GET /api/dictionaries/directions` - Направления перевозок
- `GET /api/dictionaries/transport-methods` - Способы перевозки
- `GET /api/dictionaries/containers` - ✅ Контейнеры (новый)
- `GET /api/car-brands` - Марки автомобилей
- `GET /api/car-brands/:id/models` - Модели по марке

## 👥 Управление пользователями (Admin)
- `GET /api/admin/users` - Список пользователей
- `POST /api/admin/users` - Создание пользователя  
- `PUT /api/admin/users/:id` - Обновление пользователя

## 🚢 Модуль отгрузки контейнеров
- `POST /vehicle-acts/:id/issue` - Выдача ТС (тип CONTAINER)
- `GET /api/dictionaries/containers` - Список контейнеров

**Версия API:** 2.2.0 | **Обновлено:** 2025-09-16