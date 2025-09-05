@echo off
chcp 65001 > nul
title Uchet_TS Project Stopper
echo ===============================================
echo    Остановка Uchet_TS Project
echo ===============================================
echo.

echo Остановка Docker контейнеров...
docker stop uchet-postgres 2>nul
docker rm uchet-postgres 2>nul

echo Удаление Docker volumes...
docker volume rm uchet-postgres-data 2>nul

echo Удаление Docker сети...
docker network rm uchet-network 2>nul

echo Закрытие процессов Node.js...
taskkill /f /im node.exe 2>nul

echo.
echo ===============================================
echo    Проект полностью остановлен!
echo ===============================================
pause