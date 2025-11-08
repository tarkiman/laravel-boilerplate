<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Laravel Vue RBAC
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Modern Laravel application dengan Vue.js frontend, Role-Based Access Control, dan user management system.
        </p>
        
        <div class="flex justify-center space-x-4">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Masuk
          </router-link>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Daftar
          </router-link>
          <router-link
            v-else
            to="/dashboard"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Dashboard
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">REST API Laravel</h3>
          <p class="text-gray-600">Backend Laravel dengan API endpoints lengkap, authentication, dan validation.</p>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Vue.js Frontend</h3>
          <p class="text-gray-600">Frontend modern dengan Vue.js 3, Composition API, dan reactive state management.</p>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">RBAC System</h3>
          <p class="text-gray-600">Role-based access control dengan permissions management yang fleksibel.</p>
        </div>
      </div>

      <div class="mt-12 bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-2xl font-semibold text-gray-900 mb-4 text-center">Fitur Utama</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
              <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">User Management</h4>
              <p class="text-gray-600 text-sm">CRUD operations untuk user dengan role assignment</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
              <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Laravel Sanctum</h4>
              <p class="text-gray-600 text-sm">API authentication dengan token-based security</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
              <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Role & Permissions</h4>
              <p class="text-gray-600 text-sm">Sistem roles dan permissions yang fleksibel</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
              <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Responsive Design</h4>
              <p class="text-gray-600 text-sm">Tailwind CSS untuk UI yang responsif dan modern</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Redirect ke dashboard jika sudah login
  if (authStore.isAuthenticated) {
    router.push({ name: 'dashboard' })
  }
})
</script>