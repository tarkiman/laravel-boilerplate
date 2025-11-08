import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/UsersNew.vue'
import Roles from '../views/Roles.vue'
import Permissions from '../views/Permissions.vue'
import Profile from '../views/Profile.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: { guest: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
        meta: { requiresAuth: true }
    },
    {
        path: '/roles',
        name: 'roles',
        component: Roles,
        meta: { requiresAuth: true }
    },
    {
        path: '/permissions',
        name: 'permissions',
        component: Permissions,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Initialize auth if we have a token but no user
    if (authStore.token && !authStore.user) {
        await authStore.fetchUser()
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' })
        return
    }

    // Check if route is guest only (redirect authenticated users)
    if (to.meta.guest && authStore.isAuthenticated) {
        const redirectRoute = authStore.getDefaultRoute()
        next(redirectRoute)
        return
    }

    next()
})

export default router