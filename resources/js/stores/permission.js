import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export const usePermissionStore = defineStore('permission', () => {
    const permissions = ref([])
    const loading = ref(false)
    const errors = ref({})

    // Get authorization header
    const getAuthHeaders = () => {
        const authStore = useAuthStore()
        return {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
        }
    }

    // Computed getters
    const groupedPermissions = computed(() => {
        const groups = {}
        permissions.value.forEach(permission => {
            const group = permission.name.split('.')[0] || 'general'
            if (!groups[group]) {
                groups[group] = []
            }
            groups[group].push(permission)
        })
        return groups
    })

    // Fetch all permissions
    const fetchPermissions = async () => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.get('/api/permissions', {
                headers: getAuthHeaders()
            })

            permissions.value = response.data.data
            return response.data
        } catch (error) {
            console.error('Error fetching permissions:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to fetch permissions'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Create a new permission
    const createPermission = async (permissionData) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.post('/api/permissions', permissionData, {
                headers: getAuthHeaders()
            })

            permissions.value.push(response.data.data)
            return response.data
        } catch (error) {
            console.error('Error creating permission:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to create permission'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Update an existing permission
    const updatePermission = async (id, permissionData) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.put(`/api/permissions/${id}`, permissionData, {
                headers: getAuthHeaders()
            })

            const index = permissions.value.findIndex(permission => permission.id === id)
            if (index !== -1) {
                permissions.value[index] = response.data.data
            }

            return response.data
        } catch (error) {
            console.error('Error updating permission:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to update permission'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Delete a permission
    const deletePermission = async (id) => {
        loading.value = true
        errors.value = {}

        try {
            await axios.delete(`/api/permissions/${id}`, {
                headers: getAuthHeaders()
            })

            permissions.value = permissions.value.filter(permission => permission.id !== id)
            return true
        } catch (error) {
            console.error('Error deleting permission:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to delete permission'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Get permission by ID
    const getPermission = async (id) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.get(`/api/permissions/${id}`, {
                headers: getAuthHeaders()
            })

            return response.data.data
        } catch (error) {
            console.error('Error fetching permission:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to fetch permission'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Get permissions by role
    const getPermissionsByRole = async (roleId) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.get(`/api/roles/${roleId}/permissions`, {
                headers: getAuthHeaders()
            })

            return response.data.data
        } catch (error) {
            console.error('Error fetching role permissions:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to fetch role permissions'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Clear errors
    const clearErrors = () => {
        errors.value = {}
    }

    return {
        permissions,
        loading,
        errors,
        groupedPermissions,
        fetchPermissions,
        createPermission,
        updatePermission,
        deletePermission,
        getPermission,
        getPermissionsByRole,
        clearErrors
    }
})