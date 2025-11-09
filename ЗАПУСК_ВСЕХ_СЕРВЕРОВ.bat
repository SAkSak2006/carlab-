@echo off
chcp 65001 >nul
title Car Lab - Запуск всех серверов

echo.
echo ════════════════════════════════════════════════════════════════════════════════
echo                      ЗАПУСК ПРОТОТИПА "CAR LAB"
echo ════════════════════════════════════════════════════════════════════════════════
echo.
echo Запускаются три сервера в отдельных окнах:
echo   1. Backend (API)      - http://localhost:5000
echo   2. CRM (Админка)      - http://localhost:5173
echo   3. Public Site        - http://localhost:3000
echo.
echo ════════════════════════════════════════════════════════════════════════════════
echo.

timeout /t 2 /nobreak >nul

echo [1/3] Запуск Backend...
start "Car Lab - Backend :5000" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Запуск CRM...
start "Car Lab - CRM :5173" cmd /k "cd /d %~dp0crm && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Запуск Public Site...
start "Car Lab - Public Site :3000" cmd /k "cd /d %~dp0public-site && npm run dev"

echo.
echo ════════════════════════════════════════════════════════════════════════════════
echo                              ✅ ГОТОВО!
echo ════════════════════════════════════════════════════════════════════════════════
echo.
echo Открыты три окна терминала:
echo   • Backend      - http://localhost:5000
echo   • CRM          - http://localhost:5173  (admin@ilialox.com / admin123)
echo   • Public Site  - http://localhost:3000
echo.
echo Подождите 10-15 секунд пока все запустится, затем откройте браузер.
echo.
echo Для остановки закройте окна терминалов или нажмите Ctrl+C в каждом.
echo.
echo ════════════════════════════════════════════════════════════════════════════════
echo.

pause
