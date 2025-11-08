<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ role?.name }} Permissions
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ role?.permissions?.length || 0 }} permissions assigned to this role
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="role?.permissions?.length > 0" class="space-y-4">
          <!-- Group permissions by prefix -->
          <div
            v-for="(permissions, groupName) in groupedPermissions"
            :key="groupName"
            class="border border-gray-200 rounded-lg"
          >
            <div class="p-3 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-medium text-gray-900 capitalize">
                  {{ groupName }} Permissions
                </h4>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {{ permissions.length }} permissions
                </span>
              </div>
            </div>

            <div class="p-3 space-y-2">
              <div
                v-for="permission in permissions"
                :key="permission.id"
                class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded"
              >
                <div class="flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">
                    {{ permission.name }}
                  </div>
                  <div v-if="permission.description" class="text-xs text-gray-500 mt-1">
                    {{ permission.description }}
                  </div>
                  <div v-else class="text-xs text-gray-400 mt-1 italic">
                    No description available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No Permissions Assigned</h3>
          <p class="mt-1 text-sm text-gray-500">
            This role doesn't have any permissions assigned yet.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="btn-secondary"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

// Computed properties
const groupedPermissions = computed(() => {
  if (!props.role?.permissions) return {}
  
  const groups = {}
  props.role.permissions.forEach(permission => {
    const group = permission.name.split('.')[0] || 'general'
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(permission)
  })
  
  // Sort groups and permissions within groups
  const sortedGroups = {}
  Object.keys(groups)
    .sort()
    .forEach(key => {
      sortedGroups[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name))
    })
  
  return sortedGroups
})
</script>