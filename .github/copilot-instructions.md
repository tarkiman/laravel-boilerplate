<!-- Laravel + Vue.js Project Instructions -->

## Project Overview
This is a modern Laravel project with Vue.js frontend integration featuring:
- Laravel 10+ REST API backend
- Vue.js 3 with Composition API frontend
- Role-Based Access Control (RBAC) system
- User CRUD operations
- Laravel Sanctum authentication
- Tailwind CSS for styling
- Vite for asset bundling

## Development Guidelines

### Backend (Laravel)
- Use Laravel resource controllers for API endpoints
- Implement proper request validation
- Use Eloquent ORM for database interactions
- Follow PSR-4 autoloading standards
- Use Laravel Sanctum for API authentication
- Implement proper error handling and API responses

### Frontend (Vue.js)
- Use Vue 3 Composition API
- Implement reactive state management with ref/reactive
- Use Vue Router for SPA navigation
- Follow component naming conventions (PascalCase)
- Use TypeScript where beneficial
- Implement proper error handling

### RBAC System
- Users can have multiple roles
- Roles have permissions
- Use Laravel policies and gates
- Implement middleware for route protection
- Create seeder for default roles and permissions

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement pagination for lists
- Use Laravel API Resources for responses
- Version APIs appropriately (/api/v1/)

### Database Design
- Use migrations for schema changes
- Implement proper foreign key constraints
- Use seeders for test data
- Follow Laravel naming conventions

### Security
- Validate all inputs
- Use CSRF protection
- Implement rate limiting
- Sanitize output
- Use Laravel Sanctum tokens

## File Structure
```
/
├── app/
│   ├── Http/Controllers/Api/
│   ├── Models/
│   ├── Policies/
│   └── Http/Requests/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── components/
│   │   ├── views/
│   │   └── router/
│   └── css/
└── routes/
    ├── api.php
    └── web.php
```