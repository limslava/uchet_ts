markdown
# Руководство разработчика Uchet_TS

## Настройка окружения

### Предварительные требования
- Node.js 16+
- PostgreSQL или Docker
- Git

### Установка
1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend  
   cd ../frontend
   npm install
Настройка базы данных
Запустите PostgreSQL (через Docker или локально)

Создайте файл .env в папке backend на основе .env.example

Настройте подключение к БД в DATABASE_URL

Выполните миграции:

bash
cd backend
npx prisma migrate dev
npx prisma generate
Запуск разработки
bash
# Backend (порт 5000)
cd backend
npm run dev

# Frontend (порт 3000)  
cd ../frontend
npm start
Структура проекта
Backend
text
src/
├── app.js              # Основной файл приложения
├── routes/             # Маршруты API
│   ├── auth.js        # Аутентификация
│   ├── vehicleActs.js # Акты приёмки
│   ├── dictionaries.js # Справочники
│   └── carBrands.js   # Марки автомобилей
├── middleware/         # Промежуточное ПО
│   └── auth.js        # JWT аутентификация
├── services/           # Бизнес-логика
│   └── VehicleActExportService.js # Генерация DOCX
├── prisma/            # Схема и миграции БД
└── seed.js            # Наполнение тестовыми данными
Frontend
text
src/
├── components/         # Переиспользуемые компоненты
│   ├── ReceivePage.js # Форма приёмки ТС
│   ├── QRScanner.js   # Сканер QR-кодов
│   └── Login.js       # Форма входа
├── pages/             # Страницы приложения
│   └── ReceiveByScan.js # Приём по QR-коду
├── services/          # API вызовы
│   └── api.js         # Функции API
├── styles/            # Стили
└── App.js             # Основной компонент
Code Style
JavaScript
Используйте современный ES6+ синтаксис

Именование функций в camelCase

Компоненты React в PascalCase

Коммиты
Используйте осмысленные сообщения коммитов

Формат: тип: описание (feat:, fix:, docs:, etc.)

Ветвление
main - стабильная версия

develop - разработка

feature/* - новые функции

hotfix/* - срочные исправления

Тестирование
Добавляйте тесты для новой функциональности

Проверяйте работу на разных устройствах

Тестируйте крайние случаи и ошибки

Code Review
Проводите ревью кода перед мержем

Проверяйте безопасность и производительность

Убедитесь в соответствии code style

Отладка
Используйте console.log для отладки

Проверяйте логи сервера

Тестируйте API через Postman

Работа с базой данных
Используйте Prisma Studio для просмотра данных: npx prisma studio

Выполняйте миграции при изменении схемы: npx prisma migrate dev

Обновляйте клиент Prisma: npx prisma generate

Безопасность
Никогда не коммитьте чувствительные данные (.env)

Проверяйте входные данные

Используйте подготовленные запросы через Prisma

Валидируйте права доступа

Производительность
Оптимизируйте запросы к базе данных

Используйте пагинацию для больших списков

Кэшируйте часто запрашиваемые данные

Версия документации: 0.5.5 | Дата обновления: 2025-09-07

# Справочник API Uchet_TS

## 🔐 Аутентификация
- `POST /api/auth/login` - вход пользователя
- `POST /api/auth/:userId/location` - выбор локации
- `GET /api/auth/me` - информация о текущем пользователе

## 📊 Справочники
- `GET /api/car-brands` - список марок автомобилей
- `GET /api/car-brands/:id/models` - модели по марке
- `GET /api/dictionaries/directions` - направления перевозок
- `GET /api/dictionaries/transport-methods` - способы перевозки

## 🚗 Управление актами приёмки
- `POST /vehicle-acts` - создание акта приёмки (с загрузкой фото, поддерживает повторяющиеся VIN)
- `GET /vehicle-acts` - список всех актов
- `GET /vehicle-acts/:id` - акт по ID
- `GET /vehicle-acts/check-vin/:vin` - проверка VIN (информационная, не блокирует создание)
- `GET /vehicle-acts/:id/export-docx` - экспорт в DOCX
- `GET /vehicle-acts/:id/print` - HTML версия для печати
- `POST /vehicle-acts/:id/receive` - подтверждение приёма ТС

## 🚗 Управление транспортными средствами
- `GET /api/vehicles` - список транспортных средств
- `POST /api/vehicles` - создание ТС
- `GET /api/vehicles/vin/:vin` - поиск ТС по VIN

## 🔍 Управление осмотрами
- `GET /api/inspections` - список осмотров
- `POST /api/inspections` - создание осмотра
- `GET /api/inspections/:id` - осмотр по ID

## 🩺 Системные endpoints
- `GET /api/health` - статус сервера
- `GET /api/test-db` - проверка подключения к БД

## 🔄 Особенности реализации
- **Повторяющиеся VIN**: система позволяет создавать multiple акты для одного VIN
- **Валидация**: сохраняется проверка формата VIN (17 символов, допустимые символы)
- **Печатные формы**: оптимизированы для корректного отображения на одной странице
- **Мобильная поддержка**: все endpoints адаптированы для мобильных устройств

## 🛡️ Безопасность
- Все защищенные endpoints требуют JWT токен
- Валидация входных данных на стороне сервера
- Защита от SQL-инъекций через Prisma ORM
- Обработка ошибок с соответствующими HTTP статусами

---

**Версия документации**: 0.5.6 | **Дата обновления**: 2025-09-08

markdown
## 🚗 Управление актами приёмки
- `POST /vehicle-acts` - создание акта приёмки (с загрузкой фото, **поддерживает повторяющиеся VIN**)
- `GET /vehicle-acts/check-vin/:vin` - **проверка VIN (информационная, не блокирует создание)**

markdown
## 🚚 Модуль выдачи ТС
- `POST /api/vehicle-issue/recipient` - выдача грузополучателю
- `POST /api/vehicle-issue/transport` - выдача на транспорт
- `GET /api/vehicle-issue/types` - доступные типы выдачи с required полями

### Поля для разных типов транспорта:
```json
{
  "auto": ["licensePlate", "driverName", "driverPhone", "carrier"],
  "railway": ["wagonNumber", "containerNumber", "destinationStation"],
  "air": ["flightNumber", "airport", "airline"],
  "marine": ["vesselName", "port", "shippingLine"]
}