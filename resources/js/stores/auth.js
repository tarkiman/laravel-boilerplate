import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const userRoles = computed(() => user.value?.roles || [])
    const hasRole = computed(() => (roleName) => {
        return userRoles.value.some(role => role.name === roleName)
    })

    // Actions
    const setError = (message) => {
        error.value = message
        setTimeout(() => {
            error.value = null
        }, 5000)
    }

    const setToken = (newToken) => {
        token.value = newToken
        if (newToken) {
            localStorage.setItem('token', newToken)
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        } else {
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
        }
    }

    const login = async (credentials) => {
        try {
            isLoading.value = true
            error.value = null

            console.log('Sending login request to /api/auth/login with:', credentials)
            const response = await axios.post('/api/auth/login', credentials)
            console.log('Login response:', response.data)

            if (response.data.success) {
                setToken(response.data.data.token)
                user.value = response.data.data.user
                return { success: true }
            } else {
                setError(response.data.message || 'Login gagal')
                return { success: false, message: response.data.message }
            }
        } catch (err) {
            console.log('Login error:', err)
            const message = err.response?.data?.message || 'Login gagal'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    const register = async (userData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await axios.post('/api/auth/register', userData)

            if (response.data.success) {
                setToken(response.data.data.token)
                user.value = response.data.data.user
                return { success: true }
            } else {
                setError(response.data.message || 'Registrasi gagal')
                return { success: false, message: response.data.message }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registrasi gagal'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        try {
            console.log('Starting logout process...')
            if (token.value) {
                console.log('Sending logout request to API...')
                const response = await axios.post('/api/auth/logout')
                console.log('Logout API response:', response.data)
            }
        } catch (err) {
            console.log('Logout API error:', err)
            // Even if API call fails, we still clear local data
        } finally {
            console.log('Clearing local auth data...')
            setToken(null)
            user.value = null
            console.log('Logout process completed')
        }
    }

    const fetchUser = async () => {
        try {
            if (!token.value) {
                console.log('No token available for fetchUser')
                return
            }

            console.log('Fetching user data from /api/auth/user...')
            const response = await axios.get('/api/auth/user')
            console.log('fetchUser response:', response.data)

            if (response.data.success) {
                user.value = response.data.data
                console.log('User data loaded successfully:', user.value)
                console.log('User roles loaded:', userRoles.value)
            }
        } catch (err) {
            console.log('Fetch user error:', err)
            // Token mungkin expired, logout
            if (err.response?.status === 401) {
                console.log('Token expired, logging out...')
                await logout()
            }
        }
    }

    // Initialize axios token if exists
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }

    // Helper function to check if user has permission
    const hasPermission = (permissionName) => {
        if (!user.value || !userRoles.value.length) return false

        return userRoles.value.some(role =>
            role.permissions && role.permissions.some(permission =>
                permission.name === permissionName
            )
        )
    }

    // Smart redirect function based on user role and permissions
    const getDefaultRoute = () => {
        if (!user.value || !userRoles.value.length) {
            return { name: 'dashboard' }
        }

        // Check if user is admin - redirect to dashboard for full overview
        const isAdmin = userRoles.value.some(role => role.name === 'admin')
        if (isAdmin) {
            return { name: 'dashboard' }
        }

        // Check permissions and redirect to the most appropriate page
        if (hasPermission('manage-users') || hasPermission('view-users')) {
            return { name: 'users' }
        }

        if (hasPermission('manage-roles') || hasPermission('view-roles')) {
            return { name: 'roles' }
        }

        if (hasPermission('manage-permissions') || hasPermission('view-permissions')) {
            return { name: 'permissions' }
        }

        // If user has no specific permissions, go to dashboard
        return { name: 'dashboard' }
    }

    return {
        // State
        user,
        token,
        isLoading,
        error,
        // Getters
        isAuthenticated,
        userRoles,
        hasRole,
        hasPermission,
        // Actions
        login,
        register,
        logout,
        fetchUser,
        setError,
        getDefaultRoute
    }
})