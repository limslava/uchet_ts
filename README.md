# Uchet_TS (Система учета транспортных средств)

Система для учета и осмотра транспортных средств на складе.

## Технический стек

- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Frontend:** React (будет добавлен позже)
- **Логирование:** Winston

## Структура проекта
uchet_ts/
├── backend/ # Node.js + Express API
├── frontend/ # React SPA (будет добавлен позже)
└── docs/ # Документация

## Начало работы

### Предварительные требования

- Node.js (v18 или выше)
- PostgreSQL
- Git

### Установка и запуск (Backend)

1.  Клонируйте репозиторий:
    ```bash
    git clone https://github.com/limslava/uchet_ts.git
    cd uchet_ts/backend
    ```

2.  Установите зависимости:
    ```bash
    npm install
    ```

3.  Настройте базу данных:
    - Создайте БД в PostgreSQL (например, `uchet_ts_db`)
    - Скопируйте `.env.example` в `.env`
    - Обновите `DATABASE_URL` в `.env` своими данными

4.  Инициализируйте БД с Prisma:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  Запустите сервер:
    ```bash
    npm run dev
    ```

Сервер будет доступен по адресу: `http://localhost:5000`

## Дорожная карта разработки

- [x] Инициализация репозитория и структуры проекта
- [ ] Настройка базового Express-сервера
- [ ] Подключение и конфигурация PostgreSQL + Prisma
- [ ] Создание основных моделей данных (Users, Vehicles, Inspections)
- [ ] Реализация модуля аутентификации и авторизации
- [ ] Разработка API для роли "Приемосдатчик"
- [ ] Интеграция библиотеки для сканирования QR-кодов
- [ ] Разработка React frontend
- [ ] Интеграция с 1С (отложенная задача)