markdown
# Uchet_TS - Система учета транспортных средств

![Version](https://img.shields.io/badge/версия-0.5.5-blue)
![Status](https://img.shields.io/badge/статус-стабильная-green)

Система для управления процессом приёмки и учёта транспортных средств с поддержкой мобильного сканирования QR-кодов.

## 🚀 Основные возможности

- **📱 Мобильное сканирование QR-кодов** - работа с камерой мобильных устройств
- **🏢 Выбор локации** - приемосдатчик может работать в разных локациях
- **📸 Загрузка фотографий** - документация состояния ТС
- **📊 Управление справочниками** - марки, модели, направления перевозок
- **🖨️ Экспорт документов** - генерация актов в DOCX и печатных форм
- **🔐 Ролевая модель** - разделение прав доступа (ADMIN, MANAGER, RECEIVER)
- **📱 Адаптивный интерфейс** - работа на мобильных устройствах и ПК

## ⚠️ Известные проблемы

- Выравнивание текста в печатной форме акта требует доработки
- Интерфейс выбора камеры в сканере QR-кодов работает нестабильно

## 🏗️ Технологический стек

### Backend
- Node.js 16+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT аутентификация
- Multer (загрузка файлов)
- Docx-templates (генерация Word)

### Frontend
- React 19+
- React Router
- HTML5-QRCode
- Axios
- React Hook Form

### Инфраструктура
- Docker
- Git
- npm

## ⚡ Быстрый старт

### Автоматический запуск (Windows)
1. Запустите `start_project.bat` для полного развёртывания
2. Остановите проект командой `stop_project.bat`

### Ручная установка
```bash
# Клонирование репозитория
git clone https://github.com/limslava/uchet_ts.git
cd uchet_ts

# Настройка базы данных
docker run -d --name uchet-postgres -p 5432:5432 \
  -e POSTGRES_DB=uchet_ts_db \
  -e POSTGRES_USER=uchet_user \
  -e POSTGRES_PASSWORD=password123 \
  postgres:15

# Бэкенд
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Фронтенд (новое окно терминала)
cd ../frontend
npm install
npm start
📁 Структура проекта
text
uchet_ts/
├── backend/                 # Node.js + Express сервер
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # JWT аутентификация
│   │   ├── prisma/         # Schema и миграции БД
│   │   └── services/       # Сервисы (экспорт DOCX)
│   ├── package.json
│   └── .env
├── frontend/                # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── services/      # API функции
│   │   └── styles/        # Стили
│   ├── public/
│   ├── package.json
│   └── .env
├── docker-compose.yml       # Конфигурация Docker
├── start_project.bat        # Автозапуск (Windows)
├── stop_project.bat         # Автоостановка (Windows)
└── README.md
🔌 API Endpoints
Основные эндпоинты:

POST /api/auth/login - аутентификация

POST /api/auth/:userId/location - выбор локации

GET /api/car-brands - список марок автомобилей

POST /vehicle-acts - создание акта приёмки

GET /vehicle-acts/:id/export-docx - экспорт в DOCX

GET /vehicle-acts/:id/print - печатная форма

Полная документация API

👥 Ролевая модель
RECEIVER - создание актов, сканирование QR-кодов, выбор локации

MANAGER - просмотр всех актов, управление справочниками

ADMIN - полный доступ, управление пользователями

🧪 Тестовые данные
Для тестирования используйте:

Логин: receiver@example.com

Пароль: password123

Тестовый VIN: ABC123456789DEF01

📋 Документация
Технологический стек

Архитектура системы

Руководство разработчика

Справочник API

История изменений

🚀 Разработка
Требования к окружению
Node.js 16+

PostgreSQL или Docker

Git

Установка для разработки
bash
# Бэкенд
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Фронтенд
cd ../frontend
npm install
npm start
📞 Поддержка
По вопросам разработки и внедрения обращайтесь к команде разработки.

⚠️ Примечание
Для работы сканера QR-кодов на мобильных устройствах в продакшене необходим HTTPS. В development-режиме можно тестировать через локальную сеть.

Версия: 0.5.5 | Статус: Стабильная | Дата: 2025-09-07

markdown
# Uchet_TS - Система учета транспортных средств

![Version](https://img.shields.io/badge/версия-0.5.7-blue)
![Status](https://img.shields.io/badge/статус-стабильная-green)

Система для управления процессом приёмки и учёта транспортных средств с поддержкой мобильного сканирования QR-кодов.

## 🚀 Основные возможности

- **📱 Мобильное сканирование QR-кодов** - работа с камерой мобильных устройств
- **🏢 Выбор локации** - приемосдатчик может работать в разных локациях
- **📸 Загрузка фотографий** - документация состояния ТС
- **📊 Управление справочниками** - марки, модели, направления перевозок
- **🖨️ Экспорт документов** - генерация актов в DOCX и печатных форм
- **🔐 Ролевая модель** - разделение прав доступа (ADMIN, MANAGER, RECEIVER)
- **📱 Адаптивный интерфейс** - работа на мобильных устройствах и ПК
- **🔄 Повторяющиеся VIN** - поддержка multiple актов для одного ТС

## 🏗️ Технологический стек

### Backend
- Node.js 16+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT аутентификация
- Multer (загрузка файлов)
- Docx-templates (генерация Word)

### Frontend
- React 19+
- React Router
- HTML5-QRCode
- Axios
- React Hook Form

### Инфраструктура
- Docker
- Git
- npm

## ⚡ Быстрый старт

### Автоматический запуск (Windows)
1. Запустите `start_project.bat` для полного развёртывания
2. Остановите проект командой `stop_project.bat`

### Ручная установка
```bash
# Клонирование репозитория
git clone https://github.com/limslava/uchet_ts.git
cd uchet_ts

# Настройка базы данных
docker run -d --name uchet-postgres -p 5432:5432 \
  -e POSTGRES_DB=uchet_ts_db \
  -e POSTGRES_USER=uchet_user \
  -e POSTGRES_PASSWORD=password123 \
  postgres:15

# Бэкенд
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Фронтенд (новое окно терминала)
cd ../frontend
npm install
npm start
📋 Документация
Технологический стек

Архитектура системы

Руководство разработчика

Справочник API

История изменений

👥 Ролевая модель
RECEIVER - создание актов, сканирование QR-кодов, выбор локации

MANAGER - просмотр всех актов, управление справочниками

ADMIN - полный доступ, управление пользователями

🧪 Тестовые данные
Для тестирования используйте:

Логин: receiver@example.com

Пароль: password123

Тестовый VIN: ABC123456789DEF01

🚀 Разработка
Требования к окружению
Node.js 16+

PostgreSQL или Docker

Git

Установка для разработки
bash
# Бэкенд
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Фронтенд
cd ../frontend
npm install
npm start
⚠️ Примечание
Для работы сканера QR-кодов на мобильных устройствах в продакшене необходим HTTPS. В development-режиме можно тестировать через локальную сеть.

Версия: 0.5.7 | Статус: Стабильная | Дата: 2025-09-08

markdown
## 🚀 Основные возможности
- **🔄 Повторяющиеся VIN** - поддержка multiple актов для одного ТС

## ⚠️ Известные проблемы
- ~~Выравнивание текста в печатной форме акта требует доработки~~ ✅ ИСПРАВЛЕНО
- ~~Интерфейс выбора камеры в сканере QR-кодов работает нестабильно~~ ✅ ИСПРАВЛЕНО