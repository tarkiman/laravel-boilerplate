import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useRoleStore = defineStore('role', () => {
    const roles = ref([])
    const loading = ref(false)
    const errors = ref({})
    const pagination = reactive({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
    })

    // Get authorization header
    const getAuthHeaders = () => {
        const authStore = useAuthStore()
        return {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
        }
    }

    // Fetch all roles with pagination
    const fetchRoles = async (page = 1, search = '') => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.get('/api/roles', {
                headers: getAuthHeaders(),
                params: {
                    page,
                    search,
                    per_page: pagination.per_page
                }
            })

            roles.value = response.data.data
            Object.assign(pagination, {
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
                from: response.data.from,
                to: response.data.to
            })

            return response.data
        } catch (error) {
            console.error('Error fetching roles:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to fetch roles'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Create a new role
    const createRole = async (roleData) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.post('/api/roles', roleData, {
                headers: getAuthHeaders()
            })

            roles.value.unshift(response.data.data)
            return response.data
        } catch (error) {
            console.error('Error creating role:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to create role'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Update an existing role
    const updateRole = async (id, roleData) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.put(`/api/roles/${id}`, roleData, {
                headers: getAuthHeaders()
            })

            const index = roles.value.findIndex(role => role.id === id)
            if (index !== -1) {
                roles.value[index] = response.data.data
            }

            return response.data
        } catch (error) {
            console.error('Error updating role:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to update role'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Delete a role
    const deleteRole = async (id) => {
        loading.value = true
        errors.value = {}

        try {
            await axios.delete(`/api/roles/${id}`, {
                headers: getAuthHeaders()
            })

            roles.value = roles.value.filter(role => role.id !== id)
            return true
        } catch (error) {
            console.error('Error deleting role:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to delete role'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Assign permissions to role
    const assignPermissions = async (roleId, permissionIds) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.post(`/api/roles/${roleId}/permissions`, {
                permissions: permissionIds
            }, {
                headers: getAuthHeaders()
            })

            const index = roles.value.findIndex(role => role.id === roleId)
            if (index !== -1) {
                roles.value[index] = response.data.data
            }

            return response.data
        } catch (error) {
            console.error('Error assigning permissions:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to assign permissions'] }
            throw error
        } finally {
            loading.value = false
        }
    }

    // Get role with permissions
    const getRoleWithPermissions = async (id) => {
        loading.value = true
        errors.value = {}

        try {
            const response = await axios.get(`/api/roles/${id}`, {
                headers: getAuthHeaders()
            })

            return response.data.data
        } catch (error) {
            console.error('Error fetching role:', error)
            errors.value = error.response?.data?.errors || { general: ['Failed to fetch role'] }
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
        roles,
        loading,
        errors,
        pagination,
        fetchRoles,
        createRole,
        updateRole,
        deleteRole,
        assignPermissions,
        getRoleWithPermissions,
        clearErrors
    }
})