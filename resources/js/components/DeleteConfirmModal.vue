<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900">
              Delete {{ itemType }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete 
                <span class="font-medium text-gray-900">"{{ item?.name }}"</span>?
                {{ getDeleteWarning() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          @click="$emit('confirm')"
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
        >
          Delete {{ itemType }}
        </button>
        <button
          @click="$emit('cancel')"
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  itemType: {
    type: String,
    required: true,
    validator: (value) => ['user', 'role', 'permission'].includes(value)
  }
})

defineEmits(['confirm', 'cancel'])

// Methods
const getDeleteWarning = () => {
  switch (props.itemType) {
    case 'user':
      return 'This will permanently remove the user and cannot be undone.'
    case 'role':
      if (props.item?.users_count > 0) {
        return `This role is assigned to ${props.item.users_count} user(s). They will lose these permissions.`
      }
      return 'This will permanently remove the role and cannot be undone.'
    case 'permission':
      if (props.item?.roles?.length > 0) {
        return `This permission is assigned to ${props.item.roles.length} role(s). It will be removed from all roles.`
      }
      return 'This will permanently remove the permission and cannot be undone.'
    default:
      return 'This action cannot be undone.'
  }
}
</script>