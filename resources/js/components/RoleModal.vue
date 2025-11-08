<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Edit Role' : 'Create New Role' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Role Information -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">Role Information</h4>
            
            <div>
              <label for="role-name" class="block text-sm font-medium text-gray-700 mb-2">
                Role Name *
              </label>
              <input
                id="role-name"
                v-model="form.name"
                type="text"
                required
                class="input-field"
                placeholder="Enter role name (e.g., admin, editor, viewer)"
                :class="{ 'border-red-300': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
            </div>

            <div>
              <label for="role-description" class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="role-description"
                v-model="form.description"
                rows="3"
                class="input-field"
                placeholder="Describe what this role can do..."
                :class="{ 'border-red-300': errors.description }"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
            </div>
          </div>

          <!-- Permissions -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-900">Permissions</h4>
              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="selectAllPermissions"
                  class="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Select All
                </button>
                <button
                  type="button"
                  @click="clearAllPermissions"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div v-if="permissionStore.loading" class="text-center py-4">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>

            <div v-else class="space-y-4 max-h-64 overflow-y-auto">
              <div
                v-for="(permissions, groupName) in permissionStore.groupedPermissions"
                :key="groupName"
                class="border border-gray-200 rounded-lg"
              >
                <div class="p-3 bg-gray-50 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <h5 class="text-sm font-medium text-gray-900 capitalize">
                      {{ groupName }} Permissions
                    </h5>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500">
                        {{ getSelectedInGroup(permissions).length }}/{{ permissions.length }}
                      </span>
                      <button
                        type="button"
                        @click="toggleGroupPermissions(permissions)"
                        class="text-xs text-indigo-600 hover:text-indigo-500"
                      >
                        {{ areAllGroupSelected(permissions) ? 'Deselect All' : 'Select All' }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="p-3 space-y-2">
                  <label
                    v-for="permission in permissions"
                    :key="permission.id"
                    class="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      :value="permission.id"
                      v-model="form.permission_ids"
                      class="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900">
                        {{ permission.name }}
                      </div>
                      <div v-if="permission.description" class="text-xs text-gray-500">
                        {{ permission.description }}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <p v-if="errors.permission_ids" class="text-sm text-red-600">{{ errors.permission_ids[0] }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end px-6 py-3 bg-gray-50 border-t border-gray-200 space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="roleStore.loading"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': roleStore.loading }"
          >
            <svg v-if="roleStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Update Role' : 'Create Role' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoleStore } from '../stores/role'
import { usePermissionStore } from '../stores/permission'

const props = defineProps({
  role: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

// Form state
const form = reactive({
  name: '',
  description: '',
  permission_ids: []
})

const errors = ref({})

// Computed properties
const selectedPermissions = computed(() => {
  return permissionStore.permissions.filter(p => form.permission_ids.includes(p.id))
})

// Methods
const initializeForm = () => {
  if (props.isEditing && props.role) {
    form.name = props.role.name || ''
    form.description = props.role.description || ''
    form.permission_ids = props.role.permissions ? props.role.permissions.map(p => p.id) : []
  } else {
    form.name = ''
    form.description = ''
    form.permission_ids = []
  }
  errors.value = {}
}

const handleSubmit = async () => {
  try {
    errors.value = {}
    
    if (props.isEditing) {
      await roleStore.updateRole(props.role.id, form)
    } else {
      await roleStore.createRole(form)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Error saving role:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['An error occurred while saving the role'] }
    }
  }
}

const selectAllPermissions = () => {
  form.permission_ids = permissionStore.permissions.map(p => p.id)
}

const clearAllPermissions = () => {
  form.permission_ids = []
}

const getSelectedInGroup = (permissions) => {
  return permissions.filter(p => form.permission_ids.includes(p.id))
}

const areAllGroupSelected = (permissions) => {
  return permissions.every(p => form.permission_ids.includes(p.id))
}

const toggleGroupPermissions = (permissions) => {
  const allSelected = areAllGroupSelected(permissions)
  const permissionIds = permissions.map(p => p.id)
  
  if (allSelected) {
    // Remove all permissions from this group
    form.permission_ids = form.permission_ids.filter(id => !permissionIds.includes(id))
  } else {
    // Add all permissions from this group
    const newIds = permissionIds.filter(id => !form.permission_ids.includes(id))
    form.permission_ids.push(...newIds)
  }
}

// Watchers
watch(() => props.role, initializeForm, { immediate: true })

// Lifecycle
onMounted(async () => {
  if (permissionStore.permissions.length === 0) {
    await permissionStore.fetchPermissions()
  }
  initializeForm()
})
</script>