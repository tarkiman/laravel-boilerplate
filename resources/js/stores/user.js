import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
    // State
    const users = ref([])
    const roles = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
    })

    // Actions
    const setError = (message) => {
        error.value = message
        setTimeout(() => {
            error.value = null
        }, 5000)
    }

    const fetchUsers = async (params = {}) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await axios.get('/api/users', { params })

            if (response.data.status === 'success') {
                users.value = response.data.data.data
                pagination.value = {
                    current_page: response.data.data.current_page,
                    last_page: response.data.data.last_page,
                    per_page: response.data.data.per_page,
                    total: response.data.data.total
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengambil data users')
        } finally {
            isLoading.value = false
        }
    }

    const createUser = async (userData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await axios.post('/api/users', userData)

            if (response.data.status === 'success') {
                users.value.unshift(response.data.data)
                return { success: true, data: response.data.data }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal membuat user'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    const updateUser = async (userId, userData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await axios.put(`/api/users/${userId}`, userData)

            if (response.data.status === 'success') {
                const index = users.value.findIndex(u => u.id === userId)
                if (index !== -1) {
                    users.value[index] = response.data.data
                }
                return { success: true, data: response.data.data }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal mengupdate user'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    const deleteUser = async (userId) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await axios.delete(`/api/users/${userId}`)

            if (response.data.status === 'success') {
                users.value = users.value.filter(u => u.id !== userId)
                return { success: true }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menghapus user'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/users/roles')

            if (response.data.status === 'success') {
                roles.value = response.data.data
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengambil data roles')
        }
    }

    const assignRole = async (userId, roleId) => {
        try {
            isLoading.value = true

            const response = await axios.post(`/api/users/${userId}/assign-role`, {
                role_id: roleId
            })

            if (response.data.status === 'success') {
                const index = users.value.findIndex(u => u.id === userId)
                if (index !== -1) {
                    users.value[index] = response.data.data
                }
                return { success: true }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal assign role'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    const removeRole = async (userId, roleId) => {
        try {
            isLoading.value = true

            const response = await axios.post(`/api/users/${userId}/remove-role`, {
                role_id: roleId
            })

            if (response.data.status === 'success') {
                const index = users.value.findIndex(u => u.id === userId)
                if (index !== -1) {
                    users.value[index] = response.data.data
                }
                return { success: true }
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal remove role'
            setError(message)
            return { success: false, message }
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        users,
        roles,
        isLoading,
        error,
        pagination,
        // Actions
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        fetchRoles,
        assignRole,
        removeRole
    }
})