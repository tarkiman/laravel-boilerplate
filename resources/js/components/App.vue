<template>
  <div id="app">
    <!-- Debug Info -->
    <div class="fixed top-0 right-0 bg-black text-white text-xs p-2 z-50" style="font-family: monospace;">
      Route: {{ route.name || 'unknown' }} | Auth: {{ authStore.isAuthenticated }} | Guest: {{ isGuestRoute }}
    </div>

    <!-- Loading State -->
    <div v-if="authStore.isLoading && authStore.token" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-gray-600">Loading application...</p>
      </div>
    </div>

    <!-- Main App -->
    <div v-else>
      <!-- Use AppLayout for authenticated users on protected routes -->
      <AppLayout v-if="authStore.isAuthenticated && !isGuestRoute">
        <router-view />
      </AppLayout>
      
      <!-- Guest Layout (Login/Register/Home) or when not authenticated -->
      <div v-else>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppLayout from './AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()

// Check if current route is a guest route (login/register/home)
const isGuestRoute = computed(() => {
  return ['login', 'register', 'home'].includes(route.name)
})

onMounted(async () => {
  // Initialize authentication state
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
})
</script>