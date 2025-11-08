# Laravel + Vue.js RBAC System

A modern Role-Based Access Control (RBAC) system built with Laravel 10+ backend and Vue.js 3 frontend.

## Features

- 🔐 **Authentication System** - Laravel Sanctum
- 👥 **User Management** - CRUD operations for users
- 🛡️ **Role Management** - Create and manage user roles
- 🔑 **Permission System** - Granular permissions control
- 🎨 **Modern UI** - Vue.js 3 + Tailwind CSS
- 📱 **Responsive Design** - Works on all devices
- ⚡ **SPA Experience** - Single Page Application

## Tech Stack

- **Backend**: Laravel 10+, MySQL, Laravel Sanctum
- **Frontend**: Vue.js 3, Pinia, Vue Router, Tailwind CSS
- **Build Tools**: Vite, PostCSS
- **Development**: Make commands, Hot reload

## Quick Start

### Prerequisites

- PHP 8.1+
- Node.js 16+
- MySQL/MariaDB
- Composer
- NPM/Yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lv-tarkiman
   ```

2. **Quick setup with Make**
   ```bash
   make quick-start
   ```
   This will install dependencies, setup environment, run migrations, seed database, and start development servers.

## Make Commands

### Development

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make dev` | Start both backend and frontend servers |
| `make backend` | Start only Laravel backend (port 8000) |
| `make frontend` | Start only Vue.js frontend (port 5173) |
| `make status` | Check server status |
| `make restart` | Restart all servers |
| `make stop` | Stop all running servers |

### Setup & Installation

| Command | Description |
|---------|-------------|
| `make install` | Install Composer + NPM dependencies |
| `make setup` | Complete project setup |
| `make quick-start` | Install + setup + start development |

### Database

| Command | Description |
|---------|-------------|
| `make migrate` | Run database migrations |
| `make seed` | Seed database with initial data |
| `make migrate-seed` | Run migrations and seed |
| `make reset-db` | Reset database (fresh + seed) |

### Build & Production

| Command | Description |
|---------|-------------|
| `make build` | Build frontend assets for production |
| `make optimize` | Optimize Laravel for production |
| `make prod-deploy` | Full production deployment |

### Utilities

| Command | Description |
|---------|-------------|
| `make routes` | Show all registered routes |
| `make api-routes` | Show only API routes |
| `make create-admin` | Create admin user |
| `make info` | Show project information |

## Development Workflow

### Daily Development

1. **Start development**
   ```bash
   make dev
   # OR
   ./dev.sh dev
   ```
   This starts both Laravel (http://localhost:8000) and Vue.js (http://localhost:5173) servers.

2. **Check status**
   ```bash
   make status
   # OR
   ./dev.sh status
   ```

3. **View logs**
   ```bash
   make logs
   ```

### Alternative Scripts

For convenience, we provide multiple ways to run commands:

#### Unix/Linux/macOS
```bash
./dev.sh dev        # Start development servers
./dev.sh install    # Install dependencies
./dev.sh setup      # Complete setup
```

#### Windows
```batch
dev.bat dev         # Start development servers
dev.bat install     # Install dependencies
dev.bat setup       # Complete setup
```

#### Make Commands (Universal)
```bash
make dev            # Start development servers
make install        # Install dependencies
make setup          # Complete setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Show user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Roles & Permissions
- `GET /api/roles` - List roles
- `POST /api/roles` - Create role
- `GET /api/permissions` - List permissions

## Default Credentials

After seeding, you can create an admin user:

```bash
make create-admin
```

Default credentials:
- **Email**: admin@example.com
- **Password**: password

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
