<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Permission Management
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage application permissions and their assignments to roles
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
          Add New Permission
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
            placeholder="Search permissions..."
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="permissionStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading permissions...</p>
    </div>

    <!-- Permissions by Group -->
    <div v-else class="space-y-6">
      <div
        v-for="(permissions, groupName) in permissionStore.groupedPermissions"
        :key="groupName"
        class="bg-white shadow-sm rounded-lg border border-gray-200"
      >
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 capitalize">{{ groupName }} Permissions</h3>
              <p class="text-sm text-gray-500">{{ permissions.length }} permissions in this group</p>
            </div>
            <button
              @click="toggleGroup(groupName)"
              class="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5 transform transition-transform duration-200"
                :class="{ 'rotate-180': expandedGroups.includes(groupName) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          v-show="expandedGroups.includes(groupName)"
          class="divide-y divide-gray-200"
        >
          <div
            v-for="permission in permissions"
            :key="permission.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ permission.name }}</h4>
                    <p v-if="permission.description" class="text-sm text-gray-500">{{ permission.description }}</p>
                    <p v-else class="text-sm text-gray-400">No description available</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <!-- Roles that have this permission -->
                <div v-if="permission.roles && permission.roles.length > 0" class="flex items-center space-x-2">
                  <span class="text-xs text-gray-500">Used by:</span>
                  <div class="flex space-x-1">
                    <span
                      v-for="role in permission.roles.slice(0, 3)"
                      :key="role.id"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {{ role.name }}
                    </span>
                    <span
                      v-if="permission.roles.length > 3"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      +{{ permission.roles.length - 3 }} more
                    </span>
                  </div>
                </div>
                <div v-else class="text-xs text-gray-400">
                  Not assigned to any role
                </div>

                <!-- Actions -->
                <div class="flex space-x-2">
                  <button
                    @click="openEditModal(permission)"
                    class="p-2 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-100"
                    title="Edit Permission"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(permission)"
                    class="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                    title="Delete Permission"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!permissionStore.loading && permissionStore.permissions.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No permissions found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new permission.</p>
      <div class="mt-6">
        <button @click="openCreateModal" class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Permission
        </button>
      </div>
    </div>

    <!-- Create/Edit Permission Modal -->
    <PermissionModal
      v-if="showPermissionModal"
      :permission="selectedPermission"
      :is-editing="isEditing"
      @close="closePermissionModal"
      @saved="handlePermissionSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :item="permissionToDelete"
      item-type="permission"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { debounce } from 'lodash'
import { usePermissionStore } from '../stores/permission'

const permissionStore = usePermissionStore()

// Component state
const searchQuery = ref('')
const expandedGroups = ref([])
const showPermissionModal = ref(false)
const showDeleteModal = ref(false)
const selectedPermission = ref(null)
const permissionToDelete = ref(null)
const isEditing = ref(false)

// Methods
const debouncedSearch = debounce(() => {
  fetchPermissions()
}, 300)

const fetchPermissions = async () => {
  try {
    await permissionStore.fetchPermissions()
    // Auto-expand first group
    if (expandedGroups.value.length === 0) {
      const groups = Object.keys(permissionStore.groupedPermissions)
      if (groups.length > 0) {
        expandedGroups.value.push(groups[0])
      }
    }
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

const toggleGroup = (groupName) => {
  const index = expandedGroups.value.indexOf(groupName)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(groupName)
  }
}

const openCreateModal = () => {
  selectedPermission.value = null
  isEditing.value = false
  showPermissionModal.value = true
}

const openEditModal = (permission) => {
  selectedPermission.value = { ...permission }
  isEditing.value = true
  showPermissionModal.value = true
}

const closePermissionModal = () => {
  showPermissionModal.value = false
  selectedPermission.value = null
  isEditing.value = false
}

const handlePermissionSaved = () => {
  closePermissionModal()
  fetchPermissions()
}

const confirmDelete = (permission) => {
  permissionToDelete.value = permission
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  permissionToDelete.value = null
}

const handleDelete = async () => {
  try {
    await permissionStore.deletePermission(permissionToDelete.value.id)
    closeDeleteModal()
    fetchPermissions()
  } catch (error) {
    console.error('Error deleting permission:', error)
    alert('Failed to delete permission')
  }
}

// Lifecycle
onMounted(() => {
  fetchPermissions()
})

// Watch for search changes
watch(searchQuery, () => {
  debouncedSearch()
})
</script>