<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-indigo-600 to-blue-600">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">
              Selamat Datang, {{ authStore.user?.name }}! 👋
            </h1>
            <p class="mt-1 text-indigo-100">
              {{ getWelcomeMessage() }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              v-for="role in authStore.userRoles" 
              :key="role.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white"
            >
              {{ role.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Roles</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalRoles }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Permissions</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalPermissions }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">My Roles</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ authStore.userRoles.length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Quick Actions -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Menu Utama
            </h3>
            
            <div class="space-y-3">
              <router-link
                v-if="canAccessUsers"
                to="/users"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex-shrink-0">
                  <span class="inline-flex p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </span>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Kelola Users</h4>
                  <p class="text-sm text-gray-500">Manage users dan assign roles</p>
                </div>
              </router-link>

              <router-link
                v-if="canAccessRoles"
                to="/roles"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex-shrink-0">
                  <span class="inline-flex p-2 bg-green-50 text-green-700 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Kelola Roles</h4>
                  <p class="text-sm text-gray-500">Manage roles dan permissions</p>
                </div>
              </router-link>

              <router-link
                v-if="canAccessPermissions"
                to="/permissions"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex-shrink-0">
                  <span class="inline-flex p-2 bg-purple-50 text-purple-700 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                    </svg>
                  </span>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Kelola Permissions</h4>
                  <p class="text-sm text-gray-500">Manage system permissions</p>
                </div>
              </router-link>

              <router-link
                to="/profile"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex-shrink-0">
                  <span class="inline-flex p-2 bg-yellow-50 text-yellow-700 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Profile Saya</h4>
                  <p class="text-sm text-gray-500">Update informasi profile</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Informasi System
            </h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">Status Login</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">Last Login</span>
                <span class="text-sm text-gray-900">{{ formatDate(authStore.user?.updated_at) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">User ID</span>
                <span class="text-sm text-gray-900">#{{ authStore.user?.id }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">Email</span>
                <span class="text-sm text-gray-900">{{ authStore.user?.email }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Roles Detail -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Role & Permissions Saya
          </h3>
          
          <div v-if="authStore.userRoles.length > 0" class="space-y-4">
            <div 
              v-for="role in authStore.userRoles" 
              :key="role.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-gray-900 capitalize">{{ role.name }}</h4>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ role.permissions?.length || 0 }} permissions
                </span>
              </div>
              <p class="text-sm text-gray-500 mb-3">{{ role.description }}</p>
              
              <div v-if="role.permissions && role.permissions.length > 0" class="flex flex-wrap gap-2">
                <span 
                  v-for="permission in role.permissions" 
                  :key="permission.id"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ permission.name }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada roles</h3>
            <p class="mt-1 text-sm text-gray-500">Anda belum memiliki role yang assigned.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { useRoleStore } from '../stores/role'
import { usePermissionStore } from '../stores/permission'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

const stats = reactive({
  totalUsers: 0,
  totalRoles: 0,
  totalPermissions: 0
})

// Computed properties for permissions
const canAccessUsers = computed(() => {
  return hasPermission('manage-users') || hasPermission('view-users')
})

const canAccessRoles = computed(() => {
  return hasPermission('manage-roles') || hasPermission('view-roles')
})

const canAccessPermissions = computed(() => {
  return hasPermission('manage-permissions') || hasPermission('view-permissions')
})

// Helper function to check permissions
const hasPermission = (permissionName) => {
  if (!authStore.userRoles.length) return false
  
  return authStore.userRoles.some(role => 
    role.permissions && role.permissions.some(permission => 
      permission.name === permissionName
    )
  )
}

// Helper function to check if user is admin
const isAdmin = computed(() => {
  return authStore.userRoles.some(role => role.name === 'admin')
})

// Get welcome message based on user role
const getWelcomeMessage = () => {
  const hour = new Date().getHours()
  let greeting = 'Selamat datang'
  
  if (hour < 12) greeting = 'Selamat pagi'
  else if (hour < 17) greeting = 'Selamat siang'
  else greeting = 'Selamat malam'
  
  if (isAdmin.value) {
    return `${greeting}! Anda memiliki akses penuh ke sistem RBAC.`
  } else if (authStore.userRoles.length > 0) {
    return `${greeting}! Anda memiliki ${authStore.userRoles.length} role aktif.`
  } else {
    return `${greeting}! Silakan hubungi admin untuk mendapatkan akses.`
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    // Fetch user data with pagination to get total count
    const userData = await userStore.fetchUsers({ per_page: 1 })
    stats.totalUsers = userData?.meta?.total || userStore.pagination.total || 0
    
    // Fetch roles data
    await roleStore.fetchRoles()
    stats.totalRoles = roleStore.roles.length
    
    // Fetch permissions data
    await permissionStore.fetchPermissions()
    stats.totalPermissions = permissionStore.permissions.length
    
    // Ensure user roles are loaded with permissions
    if (authStore.user && authStore.userRoles.length === 0) {
      await authStore.fetchUser()
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>