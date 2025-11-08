<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Role Management
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage roles and their permissions for your application
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
          Add New Role
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
            placeholder="Search roles..."
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="roleStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading roles...</p>
    </div>

    <!-- Roles Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="role in roleStore.roles"
        :key="role.id"
        class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 capitalize">{{ role.name }}</h3>
                <p class="text-sm text-gray-500">{{ role.permissions?.length || 0 }} permissions</p>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button
                @click="openEditModal(role)"
                class="p-2 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-100"
                title="Edit Role"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(role)"
                class="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                title="Delete Role"
                :disabled="role.name === 'super_admin'"
                :class="{ 'opacity-50 cursor-not-allowed': role.name === 'super_admin' }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="role.description" class="mb-4">
            <p class="text-sm text-gray-600">{{ role.description }}</p>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Users</span>
              <span class="font-medium text-gray-900">{{ role.users_count || 0 }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Created</span>
              <span class="text-gray-900">{{ formatDate(role.created_at) }}</span>
            </div>
          </div>

          <!-- Permissions Preview -->
          <div v-if="role.permissions && role.permissions.length > 0" class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Permissions</span>
              <button
                @click="openPermissionsModal(role)"
                class="text-xs text-indigo-600 hover:text-indigo-500"
              >
                View All
              </button>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(permission, index) in role.permissions.slice(0, 3)"
                :key="permission.id"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                {{ permission.name }}
              </span>
              <span
                v-if="role.permissions.length > 3"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500"
              >
                +{{ role.permissions.length - 3 }} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!roleStore.loading && roleStore.roles.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new role.</p>
      <div class="mt-6">
        <button @click="openCreateModal" class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Role
        </button>
      </div>
    </div>

    <!-- Create/Edit Role Modal -->
    <RoleModal
      v-if="showRoleModal"
      :role="selectedRole"
      :is-editing="isEditing"
      @close="closeRoleModal"
      @saved="handleRoleSaved"
    />

    <!-- Permissions Modal -->
    <PermissionsModal
      v-if="showPermissionsModal"
      :role="selectedRole"
      @close="closePermissionsModal"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item="roleToDelete"
      item-type="role"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash'
import { useRoleStore } from '../stores/role'
import { usePermissionStore } from '../stores/permission'

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

// Component state
const searchQuery = ref('')
const showRoleModal = ref(false)
const showPermissionsModal = ref(false)
const showDeleteModal = ref(false)
const selectedRole = ref(null)
const roleToDelete = ref(null)
const isEditing = ref(false)

// Methods
const debouncedSearch = debounce(() => {
  fetchRoles(1)
}, 300)

const fetchRoles = async (page = 1) => {
  try {
    await roleStore.fetchRoles(page, searchQuery.value)
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const openCreateModal = () => {
  selectedRole.value = null
  isEditing.value = false
  showRoleModal.value = true
}

const openEditModal = (role) => {
  selectedRole.value = { ...role }
  isEditing.value = true
  showRoleModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedRole.value = null
  isEditing.value = false
}

const handleRoleSaved = () => {
  closeRoleModal()
  fetchRoles(roleStore.pagination.current_page)
}

const openPermissionsModal = (role) => {
  selectedRole.value = role
  showPermissionsModal.value = true
}

const closePermissionsModal = () => {
  showPermissionsModal.value = false
  selectedRole.value = null
}

const confirmDelete = (role) => {
  if (role.name === 'super_admin') {
    alert('Cannot delete super admin role')
    return
  }
  roleToDelete.value = role
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  roleToDelete.value = null
}

const handleDelete = async () => {
  try {
    await roleStore.deleteRole(roleToDelete.value.id)
    closeDeleteModal()
    fetchRoles(roleStore.pagination.current_page)
  } catch (error) {
    console.error('Error deleting role:', error)
    alert('Failed to delete role')
  }
}

// Utility methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  fetchRoles()
  permissionStore.fetchPermissions()
})

// Watch for search changes
watch(searchQuery, () => {
  debouncedSearch()
})
</script>