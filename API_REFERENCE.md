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

# Справочник API

## Публичные endpoints (требуют аутентификации)

### Транспортные средства перевозчиков
- `GET /api/dictionaries/company-vehicles` - Получить список ТС перевозчиков
  - Параметры:
    - `isActive` - фильтр по активности (true/false)
    - `park` - фильтр по парку (Собственный/Привлеченный)

### Контейнеры
- `GET /api/dictionaries/containers` - Получить список контейнеров

### Автомобильные марки
- `GET /api/dictionaries/car-brands` - Получить список марок автомобилей

### Направления перевозок
- `GET /api/dictionaries/directions` - Получить список направлений

### Способы перевозки
- `GET /api/dictionaries/transport-methods` - Получить список способов перевозки

## Выдача транспортных средств

### Типы выдачи
- `RECIPIENT` - Выдача грузополучателю
- `TRANSPORT` - Выдача на транспорт
- `CONTAINER` - Погрузка в контейнер
- `GRID` - Погрузка в сетку
- `CURTAIN_TRUCK` - Погрузка в автовоз-штору
- `AUTOCARRIER` - Погрузка на автовоз

### Статусы VehicleAct
- `NEW` - Новый
- `RECEIVED` - Принят
- `COMPLETED` - Завершен
- `CANCELLED` - Отменен
- `LOADED_INTO_CONTAINER` - Погружен в контейнер
- `LOADED_INTO_GRID` - Погружен в сетку
- `LOADED_INTO_CURTAIN_TRUCK` - Погружен в автовоз-штору
- `LOADED_INTO_AUTOCARRIER` - Отгружен на автовоз