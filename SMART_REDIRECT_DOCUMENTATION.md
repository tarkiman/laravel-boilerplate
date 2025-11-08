# Smart Redirect System Documentation

## Overview
The smart redirect system automatically routes users to the most appropriate page after login/register based on their roles and permissions, providing a better user experience.

## How It Works

### Smart Redirect Logic
Located in `stores/auth.js`, the `getDefaultRoute()` function determines the best route based on:

1. **Admin Users**: Always redirected to dashboard for full system overview
2. **Permission-Based Routing**:
   - Users with `manage-users` or `view-users` → Users page
   - Users with `manage-roles` or `view-roles` → Roles page  
   - Users with `manage-permissions` or `view-permissions` → Permissions page
3. **Fallback**: Users with no specific permissions → Dashboard

### Implementation Details

#### Auth Store Enhancement
```javascript
// New helper function to check permissions
const hasPermission = (permissionName) => {
    if (!user.value || !userRoles.value.length) return false
    
    return userRoles.value.some(role => 
        role.permissions && role.permissions.some(permission => 
            permission.name === permissionName
        )
    )
}

// Smart redirect function
const getDefaultRoute = () => {
    if (!user.value || !userRoles.value.length) {
        return { name: 'dashboard' }
    }

    // Admin check
    const isAdmin = userRoles.value.some(role => role.name === 'admin')
    if (isAdmin) {
        return { name: 'dashboard' }
    }

    // Permission-based routing
    if (hasPermission('manage-users') || hasPermission('view-users')) {
        return { name: 'users' }
    }
    
    if (hasPermission('manage-roles') || hasPermission('view-roles')) {
        return { name: 'roles' }
    }
    
    if (hasPermission('manage-permissions') || hasPermission('view-permissions')) {
        return { name: 'permissions' }
    }

    // Fallback
    return { name: 'dashboard' }
}
```

#### Updated Login/Register Components
Both `Login.vue` and `Register.vue` now use smart redirect:

```javascript
const handleLogin = async () => {
    const result = await authStore.login(loginForm)
    
    if (result.success) {
        // Wait for user data to be fully loaded
        await authStore.fetchUser()
        // Use smart redirect based on user's role/permissions
        const redirectRoute = authStore.getDefaultRoute()
        router.push(redirectRoute)
    }
}
```

#### Router Guard Updates
Navigation guards also use smart redirect for authenticated users accessing guest routes:

```javascript
// Check if route is guest only (redirect authenticated users)
if (to.meta.guest && authStore.isAuthenticated) {
    const redirectRoute = authStore.getDefaultRoute()
    next(redirectRoute)
    return
}
```

## Test Users

The system includes several test users to demonstrate smart redirect:

| Email | Password | Role | Expected Redirect |
|-------|----------|------|-------------------|
| admin@example.com | password | Admin | Dashboard (full access) |
| hr@example.com | password | HR | Users page (user management) |
| rolemanager@example.com | password | Role Manager | Roles page (role management) |
| manager@example.com | password | Manager | Users page (user management) |
| user@example.com | password | User | Dashboard (basic access) |

## Benefits

1. **Better UX**: Users land on pages they can actually use
2. **Role-Appropriate Landing**: Each role gets relevant starting point
3. **Reduced Navigation**: Users don't need to manually navigate to their work area
4. **Permission-Aware**: Respects the RBAC system permissions
5. **Fallback Safety**: Always has a safe landing page (dashboard)

## Future Enhancements

1. **Customizable Preferences**: Allow users to set their preferred landing page
2. **Last Visited Page**: Remember and redirect to the last page user was working on
3. **Context-Aware Routing**: Consider current work context for smarter routing
4. **Analytics Integration**: Track user flow patterns to optimize redirects

## Testing the System

1. **Login Tests**: Try logging in with different test users
2. **Register Tests**: Create new users and verify appropriate redirects
3. **Permission Changes**: Modify user permissions and test redirect behavior
4. **Role Updates**: Change user roles and verify new redirect logic

## Configuration

The redirect logic can be customized in `stores/auth.js` by modifying the `getDefaultRoute()` function to match your application's specific needs and route structure.