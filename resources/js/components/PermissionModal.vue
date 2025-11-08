<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Edit Permission' : 'Create New Permission' }}
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
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Permission Name -->
        <div>
          <label for="permission-name" class="block text-sm font-medium text-gray-700 mb-2">
            Permission Name *
          </label>
          <input
            id="permission-name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="e.g., users.create, posts.edit, admin.access"
            :class="{ 'border-red-300': errors.name }"
          />
          <p class="mt-1 text-xs text-gray-500">
            Use dot notation for grouping (e.g., users.create, users.edit)
          </p>
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
        </div>

        <!-- Permission Description -->
        <div>
          <label for="permission-description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="permission-description"
            v-model="form.description"
            rows="3"
            class="input-field"
            placeholder="Describe what this permission allows..."
            :class="{ 'border-red-300': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
        </div>

        <!-- Permission Guard Name (Optional Advanced Field) -->
        <div>
          <label for="permission-guard" class="block text-sm font-medium text-gray-700 mb-2">
            Guard Name
          </label>
          <select
            id="permission-guard"
            v-model="form.guard_name"
            class="input-field"
            :class="{ 'border-red-300': errors.guard_name }"
          >
            <option value="web">Web</option>
            <option value="api">API</option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            Specify which guard this permission applies to
          </p>
          <p v-if="errors.guard_name" class="mt-1 text-sm text-red-600">{{ errors.guard_name[0] }}</p>
        </div>

        <!-- Current Roles (for editing) -->
        <div v-if="isEditing && permission?.roles?.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Currently Assigned to Roles
          </label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="role in permission.roles"
              :key="role.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {{ role.name }}
            </span>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errors.general[0] }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="permissionStore.loading"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': permissionStore.loading }"
          >
            <svg v-if="permissionStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Update Permission' : 'Create Permission' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { usePermissionStore } from '../stores/permission'

const props = defineProps({
  permission: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const permissionStore = usePermissionStore()

// Form state
const form = reactive({
  name: '',
  description: '',
  guard_name: 'web'
})

const errors = ref({})

// Methods
const initializeForm = () => {
  if (props.isEditing && props.permission) {
    form.name = props.permission.name || ''
    form.description = props.permission.description || ''
    form.guard_name = props.permission.guard_name || 'web'
  } else {
    form.name = ''
    form.description = ''
    form.guard_name = 'web'
  }
  errors.value = {}
}

const handleSubmit = async () => {
  try {
    errors.value = {}
    
    if (props.isEditing) {
      await permissionStore.updatePermission(props.permission.id, form)
    } else {
      await permissionStore.createPermission(form)
    }
    
    emit('saved')
  } catch (error) {
    console.error('Error saving permission:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['An error occurred while saving the permission'] }
    }
  }
}

// Watchers
watch(() => props.permission, initializeForm, { immediate: true })

// Lifecycle
onMounted(() => {
  initializeForm()
})
</script>