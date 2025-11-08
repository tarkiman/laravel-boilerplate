# Development Commands Cheat Sheet

## Quick Commands Reference

### 🚀 Start Development
```bash
# All methods do the same thing:
make dev
./dev.sh dev
dev.bat dev         # Windows only
```

### 🛑 Stop Servers
```bash
make stop
./dev.sh stop
dev.bat stop        # Windows only
```

### 📊 Check Status
```bash
make status
./dev.sh status
dev.bat status      # Windows only
```

### 🔧 Setup Project (First Time)
```bash
make quick-start
# OR step by step:
make install        # Install dependencies
make setup          # Setup environment & database
```

### 🗄️ Database Operations
```bash
make migrate        # Run migrations
make seed          # Seed database
make migrate-seed  # Both migrations and seed
make reset-db      # Fresh migration + seed (⚠️ destroys data)
```

### 🏗️ Build Assets
```bash
make build         # Production build
npm run build      # Direct NPM command
```

## URLs

- **Frontend (Development)**: http://localhost:5173
- **Backend (Laravel)**: http://localhost:8000
- **API Base**: http://localhost:8000/api

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill process using port 8000
make stop
# OR manually:
pkill -f "php artisan serve"
```

### NPM/Node Issues
```bash
# Clear NPM cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Laravel Issues
```bash
# Clear all caches
make clear-cache

# Reset everything
make clean
make install
```

### Database Issues
```bash
# Reset database completely
make reset-db

# Check database connection
php artisan tinker
# In tinker: DB::connection()->getPdo();
```

### Permission Issues (macOS/Linux)
```bash
# Fix storage permissions
sudo chown -R $USER:$USER storage/
sudo chmod -R 775 storage/

# Fix bootstrap cache permissions
sudo chown -R $USER:$USER bootstrap/cache/
sudo chmod -R 775 bootstrap/cache/
```

## Development Workflow

### 1. First Time Setup
```bash
git clone <repository>
cd lv-tarkiman
make quick-start
```

### 2. Daily Development
```bash
# Start working
make dev

# Check if everything is running
make status

# When done
make stop
```

### 3. Database Changes
```bash
# After creating new migration
php artisan make:migration create_something_table
make migrate

# Reset database during development
make reset-db
```

### 4. Frontend Changes
```bash
# Development (auto-reload)
make dev

# Production build
make build
```

## Useful Aliases

Add these to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
alias ldev='make dev'
alias lstop='make stop' 
alias lstatus='make status'
alias lmigrate='make migrate'
alias lreset='make reset-db'
alias lbuild='make build'
```

## IDE/Editor Setup

### VS Code
Recommended extensions:
- Laravel Extension Pack
- Vue Language Features (Volar)
- Tailwind CSS IntelliSense
- PHP Intelephense

### PhpStorm
- Enable Laravel plugin
- Configure Vue.js support
- Set up Tailwind CSS

## Git Workflow

### Development Branch
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### Before Committing
```bash
# Run tests
make test

# Check code quality
php artisan pint  # Laravel Pint for code formatting
```

## Production Deployment

```bash
# Build for production
make prod-deploy

# OR manual steps:
make build
make optimize
```

## Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="Laravel Vue RBAC"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_vue_rbac
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Common Issues & Solutions

### 1. "Route not found" errors
- Check if API routes are registered in `bootstrap/app.php`
- Run `make api-routes` to verify

### 2. CORS issues
- Ensure frontend is accessing backend on correct port
- Check `resources/js/bootstrap.js` for correct base URL

### 3. Authentication not working
- Check if Sanctum is properly configured
- Verify API routes are protected with `auth:sanctum`

### 4. Styling issues
- Run `npm run build` to rebuild assets
- Check if Tailwind classes are being purged incorrectly

### 5. Database connection failed
- Verify database credentials in `.env`
- Ensure MySQL/MariaDB is running
- Test connection: `php artisan tinker`, then `DB::connection()->getPdo()`