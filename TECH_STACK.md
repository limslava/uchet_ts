## 📄 TECH_STACK.md

```markdown
# Технологический стек Uchet_TS

## 🎯 Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **ORM**: Prisma 5.x + PostgreSQL 15.x
- **Аутентификация**: JWT + Bcryptjs
- **Загрузка файлов**: Multer
- **Документы**: Docx-templates

## 🎯 Frontend
- **UI Framework**: React 19.x
- **Навигация**: React Router DOM 7.x
- **Формы**: React Hook Form 7.x
- **QR-коды**: HTML5-QRCode 2.x
- **HTTP клиент**: Axios 1.x

## 📊 База данных
- **PostgreSQL** с полной индексацией
- **Prisma Migrate** для миграций
- **Prisma Studio** для визуального редактирования

## 🔧 Инструменты разработки
- **Линтинг**: ESLint + Prettier
- **Автоперезагрузка**: Nodemon
- **Сборка**: React Scripts

## ⚠️ Известные технические проблемы
1. **Отсутствующие эндпоинты**:
   - `POST /vehicle-acts/:id/issue` - 404 ошибка
   - `GET /vehicle-acts/:id/print` - не реализован

2. **Проблемы производительности**:
   - Медленные COUNT запросы
   - Обработчики кликов до 1940ms

3. **Интеграционные проблемы**:
   - Ошибка 500 при обновлении актов
   - Не отображаются фотографии

## 🚀 Оптимизации
- ✅ Кэширование запросов (5 секунд)
- ✅ Индексация внешних ключей
- ✅ Групповые запросы к БД
- ✅ Мемоизация компонентов

**Версия стека:** 2.1.0 | **Обновлено:** 2025-09-14

markdown
## 📦 Модуль отгрузки
- **Multi QR-scanning** - Множественное сканирование HTML5-QRCode
- **Location validation** - Валидация локаций в реальном времени
- **Container management** - Интеграция со справочником контейнеров

## 🔧 Оптимизации
- Кэширование запросов контейнеров
- Мемоизация компонентов сканирования
- Валидация данных перед отправкой

## 🎯 Решенные технические проблемы
1. **✅ Отсутствующие эндпоинты**: `POST /vehicle-acts/:id/issue` - реализован
2. **✅ Проблемы производительности**: Оптимизированы запросы контейнеров
3. **✅ Интеграционные проблемы**: Исправлена ошибка 500 при обновлении актов

## 📦 Модуль отгрузки
- **Multi QR-scanning** - Множественное сканирование HTML5-QRCode
- **Location validation** - Валидация локаций в реальном времени
- **Status management** - Автоматическое обновление статусов

## 🔧 Оптимизации
- Кэширование запросов контейнеров (5 секунд)
- Мемоизация компонентов сканирования
- Валидация данных перед отправкой

**Версия стека:** 2.2.0 | **Обновлено:** 2025-09-16

# Технологический стек

## Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Logging**: Winston
- **Validation**: Joi + custom middleware

## Frontend  
- **Framework**: React 18
- **Routing**: React Router
- **HTTP Client**: Fetch API + axios (admin)
- **State Management**: React hooks
- **Styling**: CSS Modules
- **QR Scanning**: react-qr-reader

## Инфраструктура
- **Web Server**: Nginx
- **SSL**: Self-signed certificates (dev)
- **Process Manager**: PM2
- **Database**: PostgreSQL with migrations

## Модули выдачи ТС
- `ContainerStuffing` - Интеграция с справочником контейнеров
- `GridLoading` - Упрощенная выдача без дополнительных полей
- `CurtainTruckLoading` - Выдача с номером пломбы
- `AutocarrierLoading` - Интеграция со справочником ТС перевозчиков

## API Design
- RESTful architecture
- JSON responses
- Error handling standardization
- Pagination and filtering
- Cache control headers