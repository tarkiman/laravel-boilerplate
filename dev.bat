@echo off
REM Laravel + Vue.js Development Scripts for Windows
REM Usage: dev.bat [command]

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="dev" goto dev
if "%1"=="backend" goto backend
if "%1"=="frontend" goto frontend
if "%1"=="install" goto install
if "%1"=="setup" goto setup
if "%1"=="migrate" goto migrate
if "%1"=="seed" goto seed
if "%1"=="build" goto build
if "%1"=="stop" goto stop
if "%1"=="status" goto status
goto help

:help
echo Laravel + Vue.js RBAC Project - Development Commands
echo ====================================================
echo.
echo Available commands:
echo   dev        Start both backend and frontend servers
echo   backend    Start only Laravel backend server
echo   frontend   Start only Vue.js frontend server
echo   install    Install all dependencies
echo   setup      Complete project setup
echo   migrate    Run database migrations
echo   seed       Seed database
echo   build      Build frontend for production
echo   stop       Stop all servers
echo   status     Check server status
echo.
echo Examples:
echo   dev.bat dev
echo   dev.bat install
echo   dev.bat setup
goto end

:dev
echo Starting Laravel + Vue.js development servers...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
start /B php artisan serve
start /B npm run dev
goto end

:backend
echo Starting Laravel backend server...
php artisan serve
goto end

:frontend
echo Starting Vue.js frontend server...
npm run dev
goto end

:install
echo Installing dependencies...
composer install
npm install
goto end

:setup
call %0 install
copy .env.example .env 2>nul
php artisan key:generate
call %0 migrate
call %0 seed
echo Project setup completed!
goto end

:migrate
echo Running database migrations...
php artisan migrate
goto end

:seed
echo Seeding database...
php artisan db:seed --class=RolePermissionSeeder
goto end

:build
echo Building frontend assets...
npm run build
goto end

:stop
echo Stopping all servers...
taskkill /F /IM "php.exe" 2>nul
taskkill /F /IM "node.exe" 2>nul
echo Servers stopped!
goto end

:status
echo Checking server status...
netstat -an | findstr :8000 >nul
if %errorlevel%==0 (
    echo Laravel Server: Running on http://localhost:8000
) else (
    echo Laravel Server: Not running
)
netstat -an | findstr :5173 >nul
if %errorlevel%==0 (
    echo Vite Server: Running on http://localhost:5173
) else (
    echo Vite Server: Not running
)
goto end

:end