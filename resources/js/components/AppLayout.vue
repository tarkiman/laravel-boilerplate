<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">RBAC Admin</h1>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <router-link
                to="/dashboard"
                class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200"
                :class="{ 'border-indigo-500 text-indigo-600': $route.name === 'dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/users"
                class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200"
                :class="{ 'border-indigo-500 text-indigo-600': $route.name === 'users' }"
              >
                Users
              </router-link>
              <router-link
                to="/roles"
                class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200"
                :class="{ 'border-indigo-500 text-indigo-600': $route.name === 'roles' }"
              >
                Roles
              </router-link>
              <router-link
                to="/permissions"
                class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200"
                :class="{ 'border-indigo-500 text-indigo-600': $route.name === 'permissions' }"
              >
                Permissions
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- User Info -->
            <div class="hidden md:flex md:items-center md:space-x-4">
              <span class="text-sm text-gray-700">
                Welcome, {{ authStore.user?.name }}
              </span>
              <span v-if="authStore.user?.roles?.length" class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {{ authStore.user.roles[0].name }}
              </span>
            </div>

            <!-- Profile Dropdown -->
            <div class="relative" v-click-outside="closeProfileMenu">
              <button
                @click="toggleProfileMenu"
                class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </div>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-show="showProfileMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeProfileMenu"
                >
                  Profile
                </router-link>
                <button
                  @click.prevent="logout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="showMobileMenu" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            class="mobile-nav-link"
            :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'dashboard' }"
            @click="closeMobileMenu"
          >
            Dashboard
          </router-link>
          <router-link
            to="/users"
            class="mobile-nav-link"
            :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'users' }"
            @click="closeMobileMenu"
          >
            Users
          </router-link>
          <router-link
            to="/roles"
            class="mobile-nav-link"
            :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'roles' }"
            @click="closeMobileMenu"
          >
            Roles
          </router-link>
          <router-link
            to="/permissions"
            class="mobile-nav-link"
            :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.name === 'permissions' }"
            @click="closeMobileMenu"
          >
            Permissions
          </router-link>
        </div>
        
        <!-- Mobile User Info -->
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="px-4">
            <div class="text-base font-medium text-gray-800">{{ authStore.user?.name }}</div>
            <div class="text-sm text-gray-500">{{ authStore.user?.email }}</div>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <router-link
              to="/profile"
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              Profile
            </router-link>
            <button
              @click.prevent="logout"
              class="w-full text-left mobile-nav-link"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Menu states
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)

// Menu handlers
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Logout handler
const logout = async () => {
  try {
    console.log('Logout button clicked')
    await authStore.logout()
    console.log('Logout completed, redirecting...')
    
    // Use window.location for guaranteed redirect
    window.location.href = '/login'
  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect even if logout API fails
    window.location.href = '/login'
  }
}

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

