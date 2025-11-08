#!/bin/bash

# Laravel + Vue.js Development Scripts
# Usage: ./dev.sh [command]

set -e

show_help() {
    echo "Laravel + Vue.js RBAC Project - Development Commands"
    echo "===================================================="
    echo ""
    echo "Available commands:"
    echo "  dev        Start both backend and frontend servers"
    echo "  backend    Start only Laravel backend server"  
    echo "  frontend   Start only Vue.js frontend server"
    echo "  install    Install all dependencies"
    echo "  setup      Complete project setup"
    echo "  migrate    Run database migrations"
    echo "  seed       Seed database"
    echo "  build      Build frontend for production"
    echo "  stop       Stop all servers"
    echo "  status     Check server status"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh dev"
    echo "  ./dev.sh install"
    echo "  ./dev.sh setup"
}

start_dev() {
    echo "🚀 Starting Laravel + Vue.js development servers..."
    echo "Backend: http://localhost:8000"
    echo "Frontend: http://localhost:5173"
    echo "Press Ctrl+C to stop both servers"
    
    trap 'stop_servers' INT
    php artisan serve &
    npm run dev &
    wait
}

start_backend() {
    echo "🔧 Starting Laravel backend server on http://localhost:8000..."
    php artisan serve
}

start_frontend() {
    echo "🎨 Starting Vue.js frontend server on http://localhost:5173..."
    npm run dev
}

install_deps() {
    echo "🔧 Installing Composer dependencies..."
    composer install
    echo "📦 Installing NPM dependencies..."
    npm install
    echo "✅ Installation completed!"
}

setup_project() {
    install_deps
    echo "⚙️  Setting up project..."
    cp .env.example .env 2>/dev/null || echo ".env already exists"
    php artisan key:generate
    run_migrate
    seed_db
    echo "✅ Project setup completed!"
}

run_migrate() {
    echo "🗄️  Running database migrations..."
    php artisan migrate
}

seed_db() {
    echo "🌱 Seeding database..."
    php artisan db:seed --class=RolePermissionSeeder
}

build_assets() {
    echo "🏗️  Building frontend assets for production..."
    npm run build
    echo "✅ Build completed!"
}

stop_servers() {
    echo "🛑 Stopping all servers..."
    pkill -f "php artisan serve" 2>/dev/null || echo "Laravel server not running"
    pkill -f "vite" 2>/dev/null || echo "Vite server not running"
    echo "✅ All servers stopped!"
}

check_status() {
    echo "📊 Server Status:"
    echo "=================="
    if pgrep -f "php artisan serve" > /dev/null; then
        echo "✅ Laravel Server: Running on http://localhost:8000"
    else
        echo "❌ Laravel Server: Not running"
    fi
    if pgrep -f "vite" > /dev/null; then
        echo "✅ Vite Server: Running on http://localhost:5173"
    else
        echo "❌ Vite Server: Not running"
    fi
}

case "$1" in
    "dev")
        start_dev
        ;;
    "backend")
        start_backend
        ;;
    "frontend")
        start_frontend
        ;;
    "install")
        install_deps
        ;;
    "setup")
        setup_project
        ;;
    "migrate")
        run_migrate
        ;;
    "seed")
        seed_db
        ;;
    "build")
        build_assets
        ;;
    "stop")
        stop_servers
        ;;
    "status")
        check_status
        ;;
    "help"|""|*)
        show_help
        ;;
esac