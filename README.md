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

# Uchet TS - Система учета транспортных средств

Система для приемосдатчиков и администраторов для управления приемом-передачей транспортных средств.

## Features

- 🔐 Role-based authentication (Admin, Manager, Receiver)
- 📍 Multi-location support
- 📝 Vehicle act creation with photos
- 📷 QR code scanning
- 🖨️ PDF generation and printing
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18
- React Router
- React Hook Form
- Axios for API calls
- CSS3 with Flexbox/Grid

### Backend
- Node.js + Express
- PostgreSQL + Prisma
- JWT authentication
- Multer for file uploads

## Quick Start

1. Install dependencies:
```bash
npm install
Set up environment variables:

env
REACT_APP_API_URL=http://localhost:5000
Start development server:

bash
npm start
Available Scripts
npm start - Development server

npm build - Production build

npm test - Run tests

npm run eject - Eject from Create React App

Project Structure
text
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── hooks/         # Custom hooks
└── styles/        # Global styles
License
MIT License - see LICENSE file for details

## 🚀 Новые возможности v2.2.0

### Панель администратора:
- 📊 Управление пользователями и ролями
- 🗃️ Полное управление системными справочниками
- 🔍 Поиск и фильтрация во всех разделах
- ✅ Валидация данных и обработка ошибок

### Доступные справочники:
- 🚗 Марки и модели автомобилей
- 🏙️ Направления (города)
- 🚛 Способы перевозки
- 🏢 Локации и склады


# Uchet_TS - Система учета транспортных средств

![Version](https://img.shields.io/badge/версия-2.1.0-blue)
![Status](https://img.shields.io/badge/статус-в%20разработке-yellow)

## ⚠️ Важное объявление

**Текущая версия имеет известные ошибки, которые решаются в отдельном чате:**

### Критические проблемы:
1. 🖨️ **Ошибка печати** - Кнопки "Распечатать акт" и "Распечатать договор" возвращают 404
2. 📊 **Данные** - Фотографии и комплектация не отображаются в панели админа
3. 💾 **Сохранение** - Ошибка 500 при обновлении актов с новыми полями

### Что работает:
- ✅ Аутентификация и авторизация
- ✅ Создание актов приёмки
- ✅ Сканирование QR-кодов
- ✅ Управление справочниками
- ✅ Базовая панель админа

## 🚀 Технологический стек
- **Frontend:** React 19, React Router, HTML5-QRCode
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **База данных:** PostgreSQL с Prisma ORM

## 📞 Поддержка
Ошибки активно исправляются. Следите за обновлениями в:
- 📋 **Project Log** - история изменений
- 🐛 **Issue Tracker** - отслеживание ошибок
- 💬 **Support Chat** - решение проблем

**Версия:** 2.1.0 | **Статус:** Разработка | **Дата:** 2025-09-08

markdown
## 🎥 Новая функция: Непрерывная съемка фото

Реализован интерфейс съемки фотографий, аналогичный WhatsApp:
- Непрерывная съемка без выхода из режима камеры
- Переключение между фронтальной и тыльной камерами
- Просмотр и удаление сделанных фото
- Горизонтальная прокрутка миниатюр

### Использование камеры:
1. Нажмите "Сделать фотографии"
2. Делайте снимки кнопкой 📸
3. Просматривайте миниатюры внизу экрана
4. Нажмите "Готово" для подтверждения

**Статус:** Разработка | **Дата:** 2025-09-10