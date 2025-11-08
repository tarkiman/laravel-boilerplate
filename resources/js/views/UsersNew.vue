<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          User Management
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage users, assign roles, and configure permissions
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          @click="openCreateModal"
          class="btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            class="input-field pl-10"
            placeholder="Search users by name or email..."
          />
        </div>
      </div>
      
      <div class="sm:w-48">
        <select
          v-model="selectedRole"
          @change="handleFilter"
          class="input-field"
        >
          <option value="">All Roles</option>
          <option v-for="role in roleStore.roles" :key="role.id" :value="role.name">
            {{ role.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="userStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div v-if="userStore.users.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
        <div class="mt-6">
          <button @click="openCreateModal" class="btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </button>
        </div>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in userStore.users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                      {{ user.name?.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getRoleColor(role.name)"
                  >
                    {{ role.name }}
                  </span>
                  <span v-if="!user.roles || user.roles.length === 0" class="text-xs text-gray-400 italic">
                    No roles assigned
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-green-100 text-green-800': user.email_verified_at,
                    'bg-yellow-100 text-yellow-800': !user.email_verified_at
                  }"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ user.email_verified_at ? 'Active' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewUserPermissions(user)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Permissions"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="openEditModal(user)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="Edit User"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    :disabled="user.id === authStore.user?.id"
                    class="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="Delete User"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="userStore.pagination.last_page > 1" class="mt-6">
      <nav class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="userStore.pagination.current_page <= 1"
            class="btn-secondary"
            :class="{ 'opacity-50 cursor-not-allowed': userStore.pagination.current_page <= 1 }"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="userStore.pagination.current_page >= userStore.pagination.last_page"
            class="btn-secondary ml-3"
            :class="{ 'opacity-50 cursor-not-allowed': userStore.pagination.current_page >= userStore.pagination.last_page }"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing {{ userStore.pagination.from }} to {{ userStore.pagination.to }} of {{ userStore.pagination.total }} results
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="{
                'bg-indigo-600 text-white': page === userStore.pagination.current_page,
                'bg-white text-gray-500 hover:text-gray-700': page !== userStore.pagination.current_page
              }"
              class="px-3 py-2 text-sm font-medium rounded-md border border-gray-300"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Modals will be added later -->
    <div v-if="showUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium mb-4">{{ isEditing ? 'Edit User' : 'Create User' }}</h3>
        <p class="text-sm text-gray-500">Modal components will be implemented next</p>
        <div class="mt-4 flex justify-end">
          <button @click="closeUserModal" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash'
import { useUserStore } from '../stores/user'
import { useRoleStore } from '../stores/role'
import { useAuthStore } from '../stores/auth'

const userStore = useUserStore()
const roleStore = useRoleStore()
const authStore = useAuthStore()

// Component state
const searchQuery = ref('')
const selectedRole = ref('')
const showUserModal = ref(false)
const showPermissionsModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const isEditing = ref(false)

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const current = userStore.pagination.current_page
  const last = userStore.pagination.last_page
  const maxVisible = 5

  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(last, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const debouncedSearch = debounce(() => {
  fetchUsers(1)
}, 300)

const fetchUsers = async (page = 1) => {
  try {
    const params = { page }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    if (selectedRole.value) {
      params.role = selectedRole.value
    }
    await userStore.fetchUsers(params)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const handleFilter = () => {
  fetchUsers(1)
}

const openCreateModal = () => {
  selectedUser.value = null
  isEditing.value = false
  showUserModal.value = true
}

const openEditModal = (user) => {
  selectedUser.value = { ...user }
  isEditing.value = true
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  selectedUser.value = null
  isEditing.value = false
}

const handleUserSaved = () => {
  closeUserModal()
  fetchUsers(userStore.pagination.current_page)
}

const viewUserPermissions = (user) => {
  selectedUser.value = user
  showPermissionsModal.value = true
}

const closePermissionsModal = () => {
  showPermissionsModal.value = false
  selectedUser.value = null
}

const confirmDelete = (user) => {
  if (user.id === authStore.user?.id) {
    alert('You cannot delete your own account')
    return
  }
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const handleDelete = async () => {
  try {
    await userStore.deleteUser(userToDelete.value.id)
    closeDeleteModal()
    fetchUsers(userStore.pagination.current_page)
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}

// Pagination methods
const prevPage = () => {
  if (userStore.pagination.current_page > 1) {
    fetchUsers(userStore.pagination.current_page - 1)
  }
}

const nextPage = () => {
  if (userStore.pagination.current_page < userStore.pagination.last_page) {
    fetchUsers(userStore.pagination.current_page + 1)
  }
}

const goToPage = (page) => {
  fetchUsers(page)
}

// Utility methods
const getRoleColor = (roleName) => {
  const colors = {
    'super_admin': 'bg-red-100 text-red-800',
    'admin': 'bg-orange-100 text-orange-800',
    'manager': 'bg-yellow-100 text-yellow-800',
    'editor': 'bg-blue-100 text-blue-800',
    'user': 'bg-green-100 text-green-800'
  }
  return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    roleStore.fetchRoles(),
    fetchUsers()
  ])
})

// Watch for search changes
watch(searchQuery, () => {
  debouncedSearch()
})
</script>