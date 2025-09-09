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

markdown
#markdown
# 📚 Справочник API Uchet_TS

## 🔐 Аутентификация

### `POST /api/auth/login`
- **Назначение**: Вход пользователя в систему
- **Тело запроса**: 
```json
{
  "email": "string",
  "password": "string"
}
Ответ:

json
{
  "token": "string",
  "user": { ... },
  "needsLocation": boolean,
  "locations": [...]
}
POST /api/auth/:userId/location
Назначение: Выбор локации пользователем

Тело запроса:

json
{
  "locationId": "number"
}
GET /api/auth/me
Назначение: Получение информации о текущем пользователе

Требует аутентификации: ✅

📊 Справочники
GET /api/dictionaries/directions
Назначение: Список направлений перевозок

GET /api/dictionaries/transport-methods
Назначение: Способы перевозки

GET /api/dictionaries/car-brands
Назначение: Список марок автомобилей с моделями

Ответ:

json
[
  {
    "id": 1,
    "name": "Toyota",
    "models": [...]
  }
]
GET /api/dictionaries/car-brands/:brandId/models
Назначение: Модели по марке автомобиля

🚗 Управление актами приёмки
POST /vehicle-acts
Назначение: Создание акта приёмки (с загрузкой фото)

Требует аутентификации: ✅

Content-Type: multipart/form-data

Поддерживает повторяющиеся VIN: ✅

GET /vehicle-acts
Назначение: Список всех актов

Требует аутентификации: ✅

GET /vehicle-acts/:id
Назначение: Акт по ID

Требует аутентификации: ✅

GET /vehicle-acts/check-vin/:vin
Назначение: Проверка VIN (информационная)

Требует аутентификации: ✅

GET /vehicle-acts/:id/export-docx
Назначение: Экспорт в DOCX

Требует аутентификации: ✅

GET /vehicle-acts/:id/print
Назначение: HTML версия для печати

Требует аутентификации: ✅

POST /vehicle-acts/:id/receive
Назначение: Подтверждение приёма ТС

Требует аутентификации: ✅

🚗 Управление транспортными средствами
GET /api/vehicles
Назначение: Список всех ТС

Требует аутентификации: ✅

POST /api/vehicles
Назначение: Создание нового ТС

Требует аутентификации: ✅

GET /api/vehicles/vin/:vin
Назначение: Поиск ТС по VIN

Требует аутентификации: ✅

🛡️ Безопасность
Все защищенные endpoints требуют JWT токен

Валидация входных данных

Защита от SQL-инъекций через Prisma ORM

Обработка ошибок с HTTP статусами

Версия: 2.0.0 | Обновлено: 2025-09-08

markdown
# API Reference

## Base URL
`https://192.168.0.121:5000/api`

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "receiver@example.com",
  "password": "password123"
}
Select Location
http
POST /api/auth/select-location
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "locationId": 1
}
Dictionaries
Get Directions
http
GET /api/dictionaries/directions
Authorization: Bearer <token>
Get Transport Methods
http
GET /api/dictionaries/transport-methods
Authorization: Bearer <token>
Get Car Brands
http
GET /api/dictionaries/car-brands
Authorization: Bearer <token>
Get Car Models by Brand
http
GET /api/dictionaries/car-brands/{brandId}/models
Authorization: Bearer <token>
Vehicle Acts
Create Vehicle Act
http
POST /api/vehicle-acts
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "date": "2024-01-15",
  "principal": "Company ABC",
  "sender": "Sender XYZ",
  "directionId": 1,
  "transportMethodId": 1,
  "vin": "ABC123456789DEFGH",
  "licensePlate": "A123BC",
  "carBrandId": 1,
  "carModelId": 1,
  "color": "Red",
  "year": 2020,
  "fuelLevel": "50%",
  "internalContents": "Documents",
  "inspectionTime": "DAY",
  "externalCondition": "CLEAN",
  "interiorCondition": "CLEAN",
  "paintInspectionImpossible": false,
  "equipment": "{\"spareWheel\": true, \"tools\": false}",
  "photos": [file1, file2]
}
Get Vehicle Act Print
http
GET /api/vehicle-acts/{actId}/print
Authorization: Bearer <token>
Models
User
typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'RECEIVER';
  location?: Location;
}
Location
typescript
interface Location {
  id: number;
  name: string;
  address: string;
  city?: string;
}
VehicleAct
typescript
interface VehicleAct {
  id: string;
  contractNumber: string;
  date: string;
  principal: string;
  sender: string;
  vin: string;
  licensePlate: string;
  status: 'NEW' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';
  // ... other fields
}

markdown
## 🔐 Аутентификация

### `POST /api/auth/login`
- **Назначение**: Вход пользователя в систему
- **Тело запроса**: 
```json
{
  "email": "string",
  "password": "string"
}
Ответ для приемосдатчика (без локации):

json
{
  "needsLocation": true,
  "userId": 1,
  "locations": [...],
  "token": "jwt_token"
}
Ответ для администратора/менеджера:

json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN",
    "location": null
  },
  "token": "jwt_token"
}
POST /api/auth/:userId/location
Назначение: Выбор локации для приемосдатчика

Тело запроса:

json
{
  "locationId": 1
}
text

### **ARCHITECTURE.md** - добавим поток авторизации:

```markdown
## 🔐 Поток аутентификации

1. **Логин пользователя** → Сервер проверяет роль и наличие локации
2. **Приемосдатчик без локации** → Получает список локаций для выбора
3. **Выбор локации** → Сервер обновляет пользователя и выдает новый токен
4. **Администратор/Менеджер** → Сразу получает доступ к системе
5. **Приемосдатчик с локацией** → Сразу получает доступ к системе

## 👥 Ролевая модель

- **ADMIN**: Полный доступ ко всем функциям системы
- **MANAGER**: Доступ к управлению справочниками и аналитике  
- **RECEIVER**: Доступ только к созданию актов приёмки (требует выбор локации)

## 📊 Управление справочниками (Админ)

### Марки автомобилей
- `GET /api/admin/dictionaries/car-brands` - список марок
- `POST /api/admin/dictionaries/car-brands` - создать марку
- `PUT /api/admin/dictionaries/car-brands/:id` - обновить марку
- `DELETE /api/admin/dictionaries/car-brands/:id` - удалить марку

### Модели автомобилей  
- `GET /api/admin/dictionaries/car-models` - список моделей
- `POST /api/admin/dictionaries/car-models` - создать модель
- `PUT /api/admin/dictionaries/car-models/:id` - обновить модель
- `DELETE /api/admin/dictionaries/car-models/:id` - удалить модель

### Направления (Города)
- `GET /api/admin/dictionaries/directions` - список направлений
- `POST /api/admin/dictionaries/directions` - создать направление
- `PUT /api/admin/dictionaries/directions/:id` - обновить направление  
- `DELETE /api/admin/dictionaries/directions/:id` - удалить направление

### Способы перевозки
- `GET /api/admin/dictionaries/transport-methods` - список способов
- `POST /api/admin/dictionaries/transport-methods` - создать способ
- `PUT /api/admin/dictionaries/transport-methods/:id` - обновить способ
- `DELETE /api/admin/dictionaries/transport-methods/:id` - удалить способ

### Локации
- `GET /api/admin/dictionaries/locations` - список локаций
- `POST /api/admin/dictionaries/locations` - создать локацию
- `PUT /api/admin/dictionaries/locations/:id` - обновить локацию
- `DELETE /api/admin/dictionaries/locations/:id` - удалить локацию