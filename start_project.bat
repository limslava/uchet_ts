@echo off
chcp 65001 > nul
title Uchet_TS Project Launcher v0.5.1
echo ===============================================
echo    Uchet_TS Project Launcher
echo    Version: 0.5.1
echo ===============================================
echo.

REM Проверяем, установлен ли Docker
echo Проверка установки Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Docker не установлен или не добавлен в PATH
    echo Установите Docker Desktop с официального сайта
    echo https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Проверяем, запущен ли Docker
echo Проверка работы Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Docker не запущен
    echo Запустите Docker Desktop и попробуйте снова
    pause
    exit /b 1
)

REM Проверяем, установлен ли Node.js
echo Проверка установки Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Node.js не установлен
    echo Установите Node.js с официального сайта
    echo https://nodejs.org/
    pause
    exit /b 1
)

REM Создаем сеть для контейнеров если не существует
echo Создание сети Docker...
docker network create uchet-network 2>nul

REM Запускаем PostgreSQL в Docker
echo Запуск PostgreSQL в Docker...
docker run -d --name uchet-postgres ^
  --network uchet-network ^
  -p 5432:5432 ^
  -e POSTGRES_DB=uchet_ts_db ^
  -e POSTGRES_USER=uchet_user ^
  -e POSTGRES_PASSWORD=password123 ^
  -v uchet-postgres-data:/var/lib/postgresql/data ^
  postgres:15

REM Ждем запуска PostgreSQL
echo Ожидание запуска PostgreSQL...
timeout /t 10 /nobreak >nul

REM Устанавливаем зависимости бэкенда если нужно
echo Установка зависимостей бэкенда...
cd backend
if not exist "node_modules" (
    echo Установка npm пакетов для бэкенда...
    npm install
)

REM Инициализируем базу данных
echo Инициализация базы данных...
npx prisma generate
npx prisma db push

REM Запускаем бэкенд в отдельном окне
echo Запуск бэкенд-сервера...
start "Uchet_TS Backend" cmd /k "npm run dev"

REM Возвращаемся в корневую папку и запускаем фронтенд
cd ..\frontend

REM Устанавливаем зависимости фронтенда если нужно
echo Установка зависимостей фронтенда...
if not exist "node_modules" (
    echo Установка npm пакетов для фронтенда...
    npm install
)

REM Запускаем фронтенд в отдельном окне
echo Запуск фронтенд-сервера...
start "Uchet_TS Frontend" cmd /k "npm start"

REM Возвращаемся в корневую папку
cd ..

echo.
echo ===============================================
echo    Проект успешно запущен!
echo ===============================================
echo Бэкенд: http://localhost:5000
echo Фронтенд: http://localhost:3000
echo.
echo Для остановки проекта запустите stop_project.bat
echo или закройте все открытые командные окна
echo ===============================================
pause