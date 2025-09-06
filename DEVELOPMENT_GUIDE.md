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