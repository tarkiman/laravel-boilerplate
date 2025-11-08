# Laravel + Vue.js Development Makefile
# Author: Laravel-Vue.js RBAC Project

.PHONY: help install dev backend frontend build clean migrate seed test serve stop status logs

# Default target
help: ## Show this help message
	@echo "Laravel + Vue.js RBAC Project - Development Commands"
	@echo "=================================================="
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation and Setup
install: ## Install all dependencies (Composer + NPM)
	@echo "🔧 Installing Composer dependencies..."
	composer install
	@echo "📦 Installing NPM dependencies..."
	npm install
	@echo "🎉 Installation completed!"

setup: install ## Complete project setup (install + env + key + migrate + seed)
	@echo "⚙️  Setting up project..."
	cp .env.example .env 2>/dev/null || echo ".env already exists"
	php artisan key:generate
	@echo "🗄️  Setting up database..."
	$(MAKE) migrate
	$(MAKE) seed
	@echo "✅ Project setup completed!"

# Development Commands
dev: ## Start both backend and frontend in development mode
	@echo "🚀 Starting Laravel + Vue.js development servers..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo "Press Ctrl+C to stop both servers"
	trap 'make stop' INT; \
	php artisan serve & \
	npm run dev & \
	wait

backend: ## Start only Laravel backend server
	@echo "🔧 Starting Laravel backend server on http://localhost:8000..."
	php artisan serve

frontend: ## Start only Vue.js frontend server
	@echo "🎨 Starting Vue.js frontend server on http://localhost:5173..."
	npm run dev

serve: backend ## Alias for backend

# Build Commands
build: ## Build Vue.js assets for production
	@echo "🏗️  Building frontend assets for production..."
	npm run build
	@echo "✅ Build completed!"

build-dev: ## Build Vue.js assets for development
	@echo "🏗️  Building frontend assets for development..."
	npm run build
	@echo "✅ Development build completed!"

# Database Commands
migrate: ## Run database migrations
	@echo "🗄️  Running database migrations..."
	php artisan migrate

migrate-fresh: ## Fresh migrate (drop all tables and re-migrate)
	@echo "🗄️  Fresh migration (WARNING: This will drop all data)..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		php artisan migrate:fresh; \
	else \
		echo "Migration cancelled."; \
	fi

seed: ## Seed database with initial data
	@echo "🌱 Seeding database..."
	php artisan db:seed --class=RolePermissionSeeder

migrate-seed: migrate seed ## Run migrations and seed database

reset-db: ## Reset database (fresh migrate + seed)
	@echo "🔄 Resetting database..."
	php artisan migrate:fresh --seed

# Testing Commands
test: ## Run PHP tests
	@echo "🧪 Running PHP tests..."
	php artisan test

test-coverage: ## Run PHP tests with coverage
	@echo "🧪 Running PHP tests with coverage..."
	php artisan test --coverage

# Maintenance Commands
clear-cache: ## Clear all Laravel caches
	@echo "🧹 Clearing caches..."
	php artisan cache:clear
	php artisan config:clear
	php artisan route:clear
	php artisan view:clear
	@echo "✅ Caches cleared!"

optimize: ## Optimize Laravel for production
	@echo "⚡ Optimizing Laravel..."
	php artisan config:cache
	php artisan route:cache
	php artisan view:cache
	@echo "✅ Optimization completed!"

clean: ## Clean build artifacts and caches
	@echo "🧹 Cleaning project..."
	rm -rf node_modules/.cache
	rm -rf public/build
	rm -rf bootstrap/cache/*.php
	$(MAKE) clear-cache
	@echo "✅ Cleanup completed!"

# Process Management
stop: ## Stop all running servers
	@echo "🛑 Stopping all servers..."
	pkill -f "php artisan serve" 2>/dev/null || echo "Laravel server not running"
	pkill -f "vite" 2>/dev/null || echo "Vite server not running"
	@echo "✅ All servers stopped!"

status: ## Show status of running servers
	@echo "📊 Server Status:"
	@echo "=================="
	@if pgrep -f "php artisan serve" > /dev/null; then \
		echo "✅ Laravel Server: Running on http://localhost:8000"; \
	else \
		echo "❌ Laravel Server: Not running"; \
	fi
	@if pgrep -f "vite" > /dev/null; then \
		echo "✅ Vite Server: Running on http://localhost:5173"; \
	else \
		echo "❌ Vite Server: Not running"; \
	fi

# Logs and Debugging
logs: ## Show Laravel logs (tail -f)
	@echo "📝 Showing Laravel logs (Press Ctrl+C to stop)..."
	tail -f storage/logs/laravel.log

routes: ## Show all registered routes
	@echo "🛤️  Registered Routes:"
	@echo "===================="
	php artisan route:list

api-routes: ## Show only API routes
	@echo "🔌 API Routes:"
	@echo "=============="
	php artisan route:list --path=api

# User Management
create-admin: ## Create admin user (interactive)
	@echo "👤 Creating admin user..."
	@echo "\$$user = \App\Models\User::create(['name' => 'Admin User', 'email' => 'admin@example.com', 'password' => \Hash::make('password')]);" | php artisan tinker
	@echo "\$$adminRole = \App\Models\Role::where('name', 'admin')->first(); if (\$$adminRole) \$$user->roles()->attach(\$$adminRole);" | php artisan tinker
	@echo "✅ Admin user created: admin@example.com / password"

# Quick Commands
quick-start: ## Quick start (install + setup + dev)
	$(MAKE) install
	$(MAKE) setup
	$(MAKE) dev

restart: ## Restart all servers
	$(MAKE) stop
	sleep 2
	$(MAKE) dev

# Useful Aliases
start: dev ## Alias for dev
run: dev ## Alias for dev
up: dev ## Alias for dev
down: stop ## Alias for stop

# Production Commands
prod-deploy: ## Deploy to production (build + optimize)
	@echo "🚀 Deploying to production..."
	$(MAKE) build
	$(MAKE) optimize
	@echo "✅ Production deployment completed!"

# Git Helpers
git-setup: ## Setup git hooks and aliases
	@echo "⚙️  Setting up git helpers..."
	@if [ -d .git ]; then \
		echo "#!/bin/bash" > .git/hooks/pre-commit; \
		echo "make test" >> .git/hooks/pre-commit; \
		chmod +x .git/hooks/pre-commit; \
		echo "✅ Git hooks installed!"; \
	else \
		echo "❌ Not a git repository"; \
	fi

# Information
info: ## Show project information
	@echo "📋 Project Information:"
	@echo "======================"
	@echo "Project: Laravel + Vue.js RBAC System"
	@echo "Laravel Version: $$(php artisan --version)"
	@echo "PHP Version: $$(php --version | head -n1)"
	@echo "Node Version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "NPM Version: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo "Database: $$(grep DB_CONNECTION .env 2>/dev/null | cut -d'=' -f2 || echo 'Not configured')"
	@echo ""
	@echo "📁 Important URLs:"
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo "API: http://localhost:8000/api"