 Руководство разработчика Uchet_TS

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
├── middleware/         # Промежуточное ПО
├── services/           # Бизнес-логика
├── prisma/            # Схема и миграции БД
└── seed.js            # Наполнение тестовыми данными
Frontend
text
src/
├── components/         # Переиспользуемые компоненты
├── pages/             # Страницы приложения
├── services/          # API вызовы
├── styles/            # Стили
└── App.js             # Основной компонент
Известные проблемы
Печатная форма акта:

Требуется исправление выравнивания текста

Реквизиты компании должны быть по правому краю

Заголовок должен быть по центру

Остальной текст должен быть по левому краю

Сканер QR-кодов:

Интерфейс выбора камеры работает некорректно

Периодические лаги при работе с камерой

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

markdown
# 🛠️ Руководство разработчика Uchet_TS

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+ или Docker
- Git

### Установка
```bash
# Клонирование репозитория
git clone https://github.com/limslava/uchet_ts.git
cd uchet_ts

# Установка зависимостей
cd backend && npm install
cd ../frontend && npm install
Настройка базы данных
bash
# Запуск PostgreSQL в Docker
docker run -d --name uchet-postgres -p 5432:5432 \
  -e POSTGRES_DB=uchet_ts_db \
  -e POSTGRES_USER=uchet_user \
  -e POSTGRES_PASSWORD=password123 \
  postgres:15

# Миграции и сидеры
cd backend
npx prisma generate
npx prisma db push
npm run seed
Запуск разработки
bash
# Backend (порт 5000)
cd backend && npm run dev

# Frontend (порт 3000)  
cd frontend && npm start
📁 Структура проекта
text
uchet_ts/
├── backend/                 # Node.js + Express сервер
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # JWT, валидация
│   │   ├── services/       # Бизнес-логика
│   │   ├── prisma/         # Схема БД и миграции
│   │   └── app.js          # Основной файл
│   ├── package.json
│   └── .env
├── frontend/                # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── services/      # API функции
│   │   ├── hooks/         # Кастомные хуки
│   │   ├── styles/        # Глобальные стили
│   │   └── App.js         # Основной компонент
│   ├── package.json
│   └── .env
└── документация/           # Документация проекта
🎨 Code Style
JavaScript
Используйте современный ES6+ синтаксис

Именование функций в camelCase

Компоненты React в PascalCase

Коммиты
text
feat: добавление новой функциональности
fix: исправление ошибок
docs: обновление документации
style: изменения форматирования
refactor: рефакторинг кода
test: добавление тестов
Ветвление
main - Стабильная версия

develop - Разработка

feature/* - Новые функции

hotfix/* - Срочные исправления

🧪 Тестирование
Запуск тестов
bash
# Frontend
cd frontend && npm test

# Backend
cd backend && npm test
Code Review
Проводите ревью кода перед мержем

Проверяйте безопасность и производительность

Убедитесь в соответствии code style

🐛 Отладка
Frontend
javascript
// Используйте React DevTools
console.log('Отладочная информация');

// Проверяйте состояние через React Developer Tools
Backend
javascript
// Логирование
console.log('Запрос:', req.body);

// Используйте Postman для тестирования API
// Проверяйте логи сервера
📦 Работа с базой данных
Prisma Commands
bash
npx prisma studio          # Визуальный редактор данных
npx prisma generate        # Генерация клиента Prisma
npx prisma db push         # Применение изменений схемы
npx prisma migrate dev     # Создание миграций
🔐 Безопасность
Рекомендации
Никогда не коммитьте .env файлы

Проверяйте входные данные

Используйте подготовленные запросы через Prisma

Валидируйте права доступа

Environment Variables
bash
# Backend .env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-secret-key"
PORT=5000

# Frontend .env
REACT_APP_API_URL="http://localhost:5000"
🚀 Производительность
Оптимизации
Используйте пагинацию для больших списков

Кэшируйте часто запрашиваемые данные

Оптимизируйте запросы к базе данных

Используйте React.memo для компонентов

Версия руководства: 2.0.0 | Обновлено: 2025-09-08

 🛠️ Руководство разработчика Uchet_TS

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+ или Docker
- Git

### Установка
```bash
# Клонирование репозитория
git clone https://github.com/limslava/uchet_ts.git
cd uchet_ts

# Установка зависимостей
cd backend && npm install
cd ../frontend && npm install
Настройка базы данных
bash
# Запуск PostgreSQL в Docker
docker run -d --name uchet-postgres -p 5432:5432 \
  -e POSTGRES_DB=uchet_ts_db \
  -e POSTGRES_USER=uchet_user \
  -e POSTGRES_PASSWORD=password123 \
  postgres:15

# Миграции и сидеры
cd backend
npx prisma generate
npx prisma db push
npm run seed
Запуск разработки
bash
# Backend (порт 5000)
cd backend && npm run dev

# Frontend (порт 3000)  
cd frontend && npm start
📁 Новая структура Backend & frontend
text
backend/
├── src/
│   ├── config/              # Конфигурационные файлы
│   │   ├── constants.js     # Константы приложения
│   │   └── server.js        # Конфигурация сервера
│   ├── controllers/         # Контроллеры (разделены по функциональности)
│   │   ├── auth/           # Контроллеры аутентификации
│   │   ├── dictionary/     # Контроллеры справочников
│   │   └── vehicle/        # Контроллеры ТС и актов
│   ├── middleware/         # Промежуточное ПО (разделено по типам)
│   │   ├── auth/          # Аутентификация
│   │   ├── error/         # Обработка ошибок
│   │   └── validation/    # Валидация
│   ├── routes/            # Маршруты (разделены по функциональности)
│   │   ├── auth/         # Маршруты аутентификации
│   │   ├── dictionary/   # Маршруты справочников
│   │   └── vehicle/      # Маршруты ТС и актов
│   ├── services/         # Сервисы и бизнес-логика
│   │   └── export/       # Сервисы экспорта
│   ├── utils/            # Вспомогательные утилиты
│   │   ├── database.js   # Утилиты работы с БД
│   │   ├── helpers.js    # Вспомогательные функции
│   │   └── logger.js     # Логирование
│   └── app.js           # Основной файл приложения
├── prisma/              # Схема БД и миграции
├── uploads/             # Загруженные файлы
├── package.json
└── .env


frontend
|   .env
|   .gitignore
|   package-lock.json
|   package.json
|   README.md
|   
+---node_modules
+---public
|       favicon.ico
|       index.html
|       logo192.png
|       logo512.png
|       manifest.json
|       robots.txt
|       
\---src
    |   App.css
    |   App.js
    |   index.css
    |   index.js
    |   logo.svg
    |   reportWebVitals.js
    |   setupTests.js
    |   ёЄЁєъЄєЁр.txt
    |   
    +---components
    |   +---auth
    |   |   +---Login
    |   |   |       Login.css
    |   |   |       Login.js
    |   |   |       
    |   |   \---ProtectedRoute
    |   |           ProtectedRoute.js
    |   |           
    |   +---common
    |   |   +---Button
    |   |   |       Button.css
    |   |   |       Button.js
    |   |   |       
    |   |   +---Input
    |   |   \---Modal
    |   \---vehicle
    |       +---Dashboard
    |       |       ReceiverDashboard.css
    |       |       ReceiverDashboard.js
    |       |       
    |       +---QrScanner
    |       |       QrScanner.css
    |       |       QrScanner.js
    |       |       
    |       \---ReceivePage
    |               EquipmentSection.js
    |               NewInspectionDialog.js
    |               PhotoUploader.js
    |               QrSection.js
    |               ReceivePage.css
    |               ReceivePage.js
    |               TransferDialog.js
    |               
    +---hooks
    |       useAuth.js
    |       
    +---pages
    |   \---ReceiveByScan
    |           ReceiveByScan.css
    |           ReceiveByScan.js
    |           
    +---services
    |       api.js
    |       
    +---styles
    |       global.css
    |       
    \---utils
🎨 Code Style
JavaScript
Используйте современный ES6+ синтаксис

Именование функций в camelCase

Компоненты React в PascalCase

Коммиты
text
feat: добавление новой функциональности
fix: исправление ошибок
docs: обновление документации
style: изменения форматирования
refactor: рефакторинг кода
test: добавление тестов
🧪 Тестирование
Запуск тестов
bash
# Frontend
cd frontend && npm test

# Backend
cd backend && npm test
🐛 Отладка
Frontend
javascript
// Используйте React DevTools
console.log('Отладочная информация');

// Проверяйте состояние через React Developer Tools
Backend
javascript
// Логирование
console.log('Запрос:', req.body);

// Используйте Postman для тестирования API
// Проверяйте логи сервера
📦 Работа с базой данных
Prisma Commands
bash
npx prisma studio          # Визуальный редактор данных
npx prisma generate        # Генерация клиента Prisma
npx prisma db push         # Применение изменений схемы
npx prisma migrate dev     # Создание миграций
🔐 Безопасность
Рекомендации
Никогда не коммитьте .env файлы

Проверяйте входные данные

Используйте подготовленные запросы через Prisma

Валидируйте права доступа

Environment Variables
bash
# Backend .env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-secret-key"
PORT=5000

# Frontend .env
REACT_APP_API_URL="http://localhost:5000"
Версия руководства: 2.1.0 | Обновлено: 2025-09-08

 Development Guide

## Setup
1. Install dependencies: `npm install`
2. Set up environment variables:
```env
REACT_APP_API_URL=https://192.168.0.121:5000
DATABASE_URL=postgresql://...
Start development server: npm start

Code Style
Use functional components with hooks

Follow React best practices

Use TypeScript for new components

ESLint + Prettier configured

Component Structure
jsx
const Component = () => {
  // Hooks first
  const [state, setState] = useState();
  
  // Then handlers
  const handleSubmit = () => {};
  
  // Then effects
  useEffect(() => {}, []);
  
  // Return JSX
  return <div>Content</div>;
};
API Integration
Use services/api.js for API calls

Handle loading states

Implement error handling

Use React Query for complex data

Testing
Jest for unit tests

React Testing Library

Cypress for E2E tests

markdown
## 🐛 Отладка проблем аутентификации

### Проверка ответа сервера
```javascript
// Добавьте в Login.js для отладки
console.log('Ответ сервера:', response);
Проверка JWT токена
Откройте DevTools → Application → Local Storage

Найдите token и вставьте на https://jwt.io

Проверьте поля: userId, role, locationId

Проверка роли пользователя
javascript
// В консоли браузера после логина
console.log('Роль пользователя:', user.role);
console.log('ID пользователя:', user.id);
common issues
Админ попадает на панель приемосдатчика: Проверить что в ответе сервера есть user.role = "ADMIN"

Не показывается выбор локации: Проверить что user.role === "RECEIVER" && !user.locationId

text

### **PROJECT_INDEX.md** - обновим текущий статус:

```markdown
## ✅ Текущий статус

### 🟢 Реализовано полностью:
- [x] JWT аутентификация с ролями
- [x] Выбор локации для приемосдатчиков  
- [x] Разделение интерфейсов по ролям
- [x] Панель администратора (управление пользователями, справочниками)

### 🟡 В разработке:
- [ ] Исправление перенаправления по ролям
- [ ] Полная интеграция аналитики
- [ ] Система уведомлений

## 🔧 Известные проблемы
1. **Перенаправление админов**: Иногда администраторы попадают на панель приемосдатчика
2. **Выбор локации**: Не всегда показывается окно выбора локации для новых пользователей


markdown
## 🛠️ Разработка справочников

### Структура компонента справочника:
1. Менеджер (Manager) - основная логика
2. Модальное окно (Modal) - форма редактирования
3. Подключение к API через adminApi
4. Валидация и обработка ошибок

### Пример создания нового справочника:
- Создайте компоненты в `src/components/admin/Dictionaries/`
- Добавьте методы в `adminApi.js`
- Подключите в `DictionaryManagement.js`

 🛠️ Руководство разработчика Uchet_TS

## 🚀 Быстрый старт
```bash
# Бэкенд
cd backend && npm run dev

# Фронтенд
cd frontend && npm start
⚠️ Известные проблемы разработки
Критические ошибки
Ошибка 404 при печати

Файлы: VehicleActsManager.js, VehicleActAdminController.js

Решение: Реализовать эндпоинты печати

Ошибка 500 при обновлении актов

Файлы: VehicleActAdminController.js, Prisma схема

Решение: Проверить обработку новых полей

Отсутствие фотографий и комплектации

Файлы: VehicleActModal.js, API endpoints

Решение: Восстановить загрузку и отображение

Как тестировать
Создайте акт через форму приемосдатчика

Попробуйте отредактировать в панели админа → Ошибка 500

Попробуйте распечатать → Ошибка 404

🔧 Отладка
javascript
// Проверка ответа API
console.log('API Response:', response.data);

// Проверка ошибок
console.error('Error details:', error.response?.data);
📋 Приоритеты исправления
✅ Выравнивание интерфейса фильтров

✅ Добавление новых полей в формы

❌ Реализация печати документов

❌ Исправление ошибок данных

Версия руководства: 2.1.0 | Обновлено: 2025-09-08

markdown
## 📷 Работа с камерой

### Компонент CameraModal
Новый компонент для непрерывной съемки фото:
- Использует Native MediaDevices API
- Поддерживает переключение камер
- Автоматически освобождает ресурсы

### Отладка камеры
- Проверьте доступ к камере в браузере
- Тестируйте на реальных мобильных устройствах
- Для локального тестирования используйте HTTP

Версия руководства: 2.1.0 | Обновлено: 2025-09-10