<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Masuk ke akun Anda
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Atau
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            buat akun baru
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ authStore.error }}
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Masukkan email Anda"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Masukkan password Anda"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ingat saya
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            @click="console.log('Login button clicked!')"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.isLoading">Memuat...</span>
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

        const handleLogin = async () => {
            console.log('=== LOGIN FUNCTION CALLED ===')
            console.log('Form data:', form.value)
            console.log('Auth store state:', { isLoading: authStore.isLoading, error: authStore.error })
            
            const result = await authStore.login(form.value)
            console.log('Login result:', result)
            
            if (result.success) {
                console.log('Login successful, fetching user data...')
                // Wait for user data to be fully loaded
                await authStore.fetchUser()
                console.log('User data fetched, user roles:', authStore.userRoles)
                
                // Small delay to ensure all data is processed
                await new Promise(resolve => setTimeout(resolve, 100))
                
                // Use smart redirect based on user's role/permissions
                const redirectRoute = authStore.getDefaultRoute()
                console.log('Smart redirect route calculated:', redirectRoute)
                
                // Try multiple redirect approaches for reliability
                try {
                    console.log('Attempting router.push redirect...')
                    await router.push(redirectRoute)
                    console.log('Router.push completed successfully')
                } catch (routerError) {
                    console.log('Router.push failed:', routerError)
                    console.log('Falling back to window.location...')
                    const routeName = redirectRoute.name
                    console.log('Redirecting to route name:', routeName)
                    window.location.href = `/${routeName}`
                }
            } else {
                console.log('Login failed:', result)
            }
            // Error will be shown by the error display above
        }

onMounted(() => {
  // Redirect if already authenticated
  if (authStore.isAuthenticated) {
    const redirectRoute = authStore.getDefaultRoute()
    const routeName = redirectRoute.name
    window.location.href = `/${routeName}`
  }
})
</script>