markdown:PROJECT_INDEX.md
# 📁 Индекс проекта Uchet_TS

## 🏗️ Структура проекта
uchet_ts/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── auth.js # Аутентификация
│ │ │ ├── vehicleActs.js # Акты приёмки ✓
│ │ │ ├── dictionaries.js # Справочники ✓
│ │ │ └── carBrands.js # Марки авто ✓
│ │ ├── middleware/
│ │ │ └── auth.js # JWT ✓
│ │ ├── services/
│ │ │ └── VehicleActExportService.js # DOCX генерация ✓
│ │ └── app.js # Главный файл ✓
│ ├── prisma/
│ │ └── schema.prisma # Schema БД ✓
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── ReceivePage.js # Форма приёмки ✓
│ │ │ ├── QrScanner.js # Сканер QR ✓
│ │ │ └── Login.js # Авторизация ✓
│ │ ├── pages/
│ │ │ └── ReceiveByScan.js # Приём по QR ✓
│ │ ├── services/
│ │ │ └── api.js # API функции ✓
│ │ └── App.js # Главный компонент ✓
│ └── package.json
└── документация/
├── ARCHITECTURE.md # Архитектура ✓
├── API_REFERENCE.md # API справка ✓
├── TECH_STACK.md # Технологии ✓
└── PROJECT_LOG.md # Лог проекта ✓

text

## ✅ Текущий статус (что уже реализовано)
- [x] Аутентификация JWT
- [x] Система актов приёмки с фото
- [x] Сканер QR-кодов (мобильный)
- [x] Печатные формы и экспорт DOCX
- [x] Система справочников
- [x] Поддержка повторяющихся VIN

## 🔄 Последние изменения
- 2025-09-08: Исправление интерфейса сканера QR
- 2025-09-08: Поддержка повторяющихся VIN
- 2025-09-07: Исправление выбора локации

markdown
# 📁 Индекс проекта Uchet_TS

## 🏗️ Структура проекта
uchet_ts/
├── backend/ # Node.js + Express сервер
│ ├── src/
│ │ ├── routes/ # API endpoints
│ │ │ ├── auth.js # Аутентификация ✓
│ │ │ ├── vehicleActs.js # Акты приёмки ✓
│ │ │ ├── dictionaries.js # Справочники ✓
│ │ │ └── carBrands.js # Марки авто ✓
│ │ ├── middleware/ # Промежуточное ПО
│ │ │ └── auth.js # JWT аутентификация ✓
│ │ ├── services/ # Сервисы
│ │ │ └── VehicleActExportService.js # DOCX генерация ✓
│ │ ├── prisma/ # Схема БД
│ │ │ └── schema.prisma # Prisma схема ✓
│ │ └── app.js # Главный файл ✓
│ └── package.json
├── frontend/ # React приложение
│ ├── src/
│ │ ├── components/ # React компоненты
│ │ │ ├── auth/ # Компоненты аутентификации
│ │ │ ├── vehicle/ # Компоненты ТС
│ │ │ └── common/ # Общие компоненты
│ │ ├── pages/ # Страницы
│ │ │ └── ReceiveByScan.js # Приём по QR ✓
│ │ ├── services/ # API функции
│ │ │ └── api.js # API функции ✓
│ │ ├── hooks/ # Кастомные хуки
│ │ ├── styles/ # Глобальные стили
│ │ └── App.js # Главный компонент ✓
│ └── package.json
└── документация/ # Документация
├── ARCHITECTURE.md # Архитектура ✓
├── API_REFERENCE.md # API справка ✓
├── TECH_STACK.md # Технологии ✓
├── DEVELOPMENT_GUIDE.md # Руководство разработчика ✓
├── PROJECT_LOG.md # Лог проекта ✓
└── README.md # Основной README ✓

text

## ✅ Текущий статус

### 🟢 Реализовано полностью:
- [x] JWT аутентификация с ролями
- [x] Система актов приёмки с фото
- [x] Сканер QR-кодов (мобильный)
- [x] Печатные формы и экспорт DOCX
- [x] Система справочников
- [x] Поддержка повторяющихся VIN
- [x] Выбор локации для пользователей
- [x] Адаптивный интерфейс

### 🟡 В разработке:
- [ ] Панель администратора
- [ ] Расширенная аналитика
- [ ] Система уведомлений
- [ ] Модуль выдачи ТС

### 🔴 Запланировано:
- [ ] PWA функциональность
- [ ] Push-уведомления
- [ ] Интеграция с 1С
- [ ] Мобильное приложение

## 🚀 Рабочие эндпоинты

### 🔓 Публичные:
- `GET /api/health` - Статус сервера
- `GET /api/test-db` - Проверка БД
- `POST /api/auth/login` - Вход пользователя

### 🔐 Защищенные (требуют JWT):
- `GET /api/auth/me` - Информация о пользователе
- `POST /vehicle-acts` - Создание акта приёмки
- `GET /vehicle-acts` - Список актов
- `GET /vehicle-acts/:id/export-docx` - Экспорт в DOCX
- `GET /vehicle-acts/:id/print` - Печатная форма

## 🧪 Тестовые данные

**Пользователь для тестирования:**
- Email: `receiver@example.com`
- Пароль: `password123`
- Роль: `RECEIVER`

**Тестовый VIN:** `ABC123456789DEF01`

## 📊 База данных

**Основные таблицы:**
- `users` - Пользователи системы
- `vehicle_acts` - Акты приёмки ТС
- `photos` - Фотографии к актам
- `car_brands`, `car_models` - Марки и модели
- `directions`, `transport_methods` - Справочники

**Версия**: 2.0.0 | **Обновлено**: 2025-09-08

`markdown
# 📁 Индекс проекта Uchet_TS

## 🏗️ Структура проекта (ОБНОВЛЕННАЯ)
uchet_ts/
├── backend/ # Node.js + Express сервер
│ ├── src/
│ │ ├── config/ # Конфигурационные файлы ✓
│ │ ├── controllers/ # Контроллеры (разделены) ✓
│ │ │ ├── auth/ # Аутентификация ✓
│ │ │ ├── dictionary/# Справочники ✓
│ │ │ └── vehicle/ # ТС и акты ✓
│ │ ├── middleware/ # Промежуточное ПО (разделено) ✓
│ │ │ ├── auth/ # JWT аутентификация ✓
│ │ │ ├── error/ # Обработка ошибок ✓
│ │ │ └── validation/# Валидация ✓
│ │ ├── routes/ # Маршруты (разделены) ✓
│ │ │ ├── auth/ # Аутентификация ✓
│ │ │ ├── dictionary/# Справочники ✓
│ │ │ └── vehicle/ # ТС и акты ✓
│ │ ├── services/ # Сервисы ✓
│ │ │ └── export/ # Экспорт DOCX ✓
│ │ ├── utils/ # Утилиты ✓
│ │ │ ├── database.js # Работа с БД ✓
│ │ │ ├── helpers.js # Помощники ✓
│ │ │ └── logger.js # Логирование ✓
│ │ └── app.js # Главный файл ✓
│ ├── prisma/ # Схема БД ✓
│ └── package.json
├── frontend/ # React приложение
│ ├── src/
│ │ ├── components/ # React компоненты
│ │ ├── pages/ # Страницы
│ │ ├── services/ # API функции ✓
│ │ ├── hooks/ # Кастомные хуки
│ │ ├── styles/ # Глобальные стили
│ │ └── App.js # Главный компонент ✓
│ └── package.json
└── документация/ # Документация проекта
├── ARCHITECTURE.md # Архитектура ✓
├── API_REFERENCE.md # API справка ✓
├── TECH_STACK.md # Технологии ✓
├── DEVELOPMENT_GUIDE.md # Руководство разработчика ✓
├── PROJECT_LOG.md # Лог проекта ✓
└── README.md # Основной README ✓

text

## ✅ Текущий статус

### 🟢 Реализовано полностью:
- [x] JWT аутентификация с ролями
- [x] Система актов приёмки с фото
- [x] Сканер QR-кодов (мобильный)
- [x] Печатные формы и экспорт DOCX
- [x] Система справочников
- [x] Поддержка повторяющихся VIN
- [x] Выбор локации для пользователей
- [x] Адаптивный интерфейс
- [x] Новая модульная структура backend

### 🟡 В разработке:
- [ ] Панель администратора
- [ ] Расширенная аналитика
- [ ] Система уведомлений
- [ ] Модуль выдачи ТС

### 🔴 Запланировано:
- [ ] PWA функциональность
- [ ] Push-уведомления
- [ ] Интеграция с 1С
- [ ] Мобильное приложение

## 🚀 Рабочие эндпоинты

### 🔓 Публичные:
- `GET /api/health` - Статус сервера
- `GET /api/test-db` - Проверка БД
- `POST /api/auth/login` - Вход пользователя

### 🔐 Защищенные (требуют JWT):
- `GET /api/auth/me` - Информация о пользователе
- `POST /vehicle-acts` - Создание акта приёмки
- `GET /vehicle-acts` - Список актов
- `GET /vehicle-acts/:id/export-docx` - Экспорт в DOCX
- `GET /vehicle-acts/:id/print` - Печатная форма
- `GET /api/dictionaries/*` - Справочники
- `GET /api/vehicles/*` - Управление ТС

## 🧪 Тестовые данные

**Пользователь для тестирования:**
- Email: `receiver@example.com`
- Пароль: `password123`
- Роль: `RECEIVER`

**Тестовый VIN:** `ABC123456789DEF01`

## 📊 База данных

**Основные таблицы:**
- `users` - Пользователи системы
- `vehicle_acts` - Акты приёмки ТС
- `photos` - Фотографии к актам
- `car_brands`, `car_models` - Марки и модели
- `directions`, `transport_methods` - Справочники

**Версия**: 2.1.0 | **Обновлено**: 2025-09-08

```markdown
# Project Index

## Core Components
- `App.js` - Main application router
- `Login.js` - Authentication component
- `ReceiverDashboard.js` - Receiver main panel
- `ReceivePage.js` - Vehicle act creation
- `ReceiveByScan.js` - QR code scanning

## Common Components
- `Button.js` - Reusable button component
- `ProtectedRoute.js` - Route protection

## Services
- `api.js` - API communication layer

## Key Features
- ✅ User authentication
- ✅ Location management  
- ✅ Vehicle act creation
- ✅ Photo upload
- ✅ QR code generation
- ✅ PDF printing
- ✅ Responsive design

## Environment Variables
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENV` - Environment (development/production)

markdown
## ✅ Текущий статус

### 🟢 Реализовано полностью:
- [x] Панель администратора
- [x] Управление пользователями
- [x] Управление справочниками:
  - [x] Марки и модели автомобилей
  - [x] Направления (города)
  - [x] Способы перевозки  
  - [x] Локации
- [x] Поиск и фильтрация
- [x] Валидация данных


```markdown
# 📁 Индекс проекта Uchet_TS

## 🏗️ Структура проекта
uchet_ts/
├── backend/ # Node.js + Express
├── frontend/ # React приложение
└── документация/ # Документация проекта

text

## ✅ Реализовано
- [x] JWT аутентификация с ролями
- [x] Система актов приёмки с фото
- [x] Мобильное сканирование QR-кодов
- [x] Панель администратора
- [x] Управление справочниками

## ⚠️ Текущие проблемы

### Критические ошибки
1. **Ошибка 404** - Эндпоинты печати не реализованы
2. **Ошибка 500** - Обновление актов с новыми полями
3. **Данные** - Фотографии и комплектация не отображаются

### Файлы для исправления
- `backend/src/controllers/admin/VehicleActAdminController.js`
- `backend/src/routes/admin/vehicleActs.js`
- `frontend/src/components/admin/VehicleActs/VehicleActModal.js`
- `frontend/src/services/adminApi.js`

## 🚀 Статус проекта
**Версия:** 2.1.0  
**Статус:** В разработке (критические ошибки)  
**Последнее обновление:** 2025-09-08

## 📞 Поддержка
Ошибки решаются в отдельном чате поддержки. Текущий фокус:
1. Реализация печати документов
2. Исправление ошибок данных
3. Восстановление функциональности

---

# 📁 Индекс проекта Uchet_TS

## ✅ Выполненные задачи

### Оптимизации производительности:
- [x] Локальное удаление записей на фронтенде
- [x] Кэширование запросов справочников (30 секунд)
- [x] Индексация всех внешних ключей
- [x] Групповые запросы для счетчиков

### Новый функционал:
- [x] Справочник водителей
- [x] Справочник ТС перевозчиков
- [x] Справочник контейнеров
- [x] Исправление смены пароля

## ⚠️ Текущие проблемы
- **Медленные обработчики кликов** (1940ms) в новых справочниках
- **Медленные COUNT запросы** при проверке связей
- **Необходима дополнительная оптимизация** производительности

## 🎯 Приоритеты
1. Решение проблемы медленных COUNT запросов
2. Оптимизация обработчиков кликов в новых справочниках
3. Внедрение дополнительных уровней кэширования

markdown
### 🔴 Критические проблемы
1. **Навигация**: Панель управления пропадает при переходе в раздел справочников
2. **API**: Ошибки 404 для новых эндпоинтов справочников