<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Profile Saya</h1>
      <p class="mt-2 text-sm text-gray-600">
        Kelola informasi profile dan pengaturan akun Anda
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
              Informasi Personal
            </h3>
            
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div v-if="message.text" :class="messageClass" class="px-4 py-3 rounded">
                {{ message.text }}
              </div>

              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div class="col-span-2 sm:col-span-1">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div class="col-span-2 sm:col-span-1">
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span v-if="isLoading">Menyimpan...</span>
                  <span v-else>Update Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Change Password -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
              Ganti Password
            </h3>
            
            <form @submit.prevent="changePassword" class="space-y-6">
              <div v-if="passwordMessage.text" :class="passwordMessageClass" class="px-4 py-3 rounded">
                {{ passwordMessage.text }}
              </div>

              <div class="space-y-4">
                <div>
                  <label for="current_password" class="block text-sm font-medium text-gray-700">
                    Password Saat Ini
                  </label>
                  <input
                    id="current_password"
                    v-model="passwordForm.current_password"
                    type="password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="new_password" class="block text-sm font-medium text-gray-700">
                    Password Baru
                  </label>
                  <input
                    id="new_password"
                    v-model="passwordForm.new_password"
                    type="password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    id="new_password_confirmation"
                    v-model="passwordForm.new_password_confirmation"
                    type="password"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isPasswordLoading"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <span v-if="isPasswordLoading">Mengupdate...</span>
                  <span v-else>Ganti Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <!-- Account Info -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Informasi Akun
            </h3>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">User ID</span>
                <span class="text-sm text-gray-900">#{{ authStore.user?.id }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">Bergabung</span>
                <span class="text-sm text-gray-900">{{ formatDate(authStore.user?.created_at) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-500">Terakhir Update</span>
                <span class="text-sm text-gray-900">{{ formatDate(authStore.user?.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- User Roles -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Role & Permissions
            </h3>
            
            <div v-if="authStore.userRoles.length > 0" class="space-y-3">
              <div 
                v-for="role in authStore.userRoles" 
                :key="role.id"
                class="border border-gray-200 rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-medium text-gray-900 capitalize">{{ role.name }}</h4>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ role.permissions?.length || 0 }} permissions
                  </span>
                </div>
                <p class="text-xs text-gray-500">{{ role.description }}</p>
              </div>
            </div>
            
            <div v-else class="text-center py-4">
              <p class="text-sm text-gray-500">Tidak ada role yang assigned</p>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-red-900 mb-4">
              Danger Zone
            </h3>
            
            <div class="space-y-3">
              <button
                @click="logout"
                class="w-full inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout dari Semua Device
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const isPasswordLoading = ref(false)

const message = ref({ text: '', type: '' })
const passwordMessage = ref({ text: '', type: '' })

const form = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Computed properties for message classes
const messageClass = computed(() => {
  return message.value.type === 'success' 
    ? 'bg-green-50 border border-green-200 text-green-700'
    : 'bg-red-50 border border-red-200 text-red-700'
})

const passwordMessageClass = computed(() => {
  return passwordMessage.value.type === 'success' 
    ? 'bg-green-50 border border-green-200 text-green-700'
    : 'bg-red-50 border border-red-200 text-red-700'
})

// Methods
const updateProfile = async () => {
  try {
    isLoading.value = true
    
    const response = await axios.put(`/api/users/${authStore.user.id}`, form.value)
    
    if (response.data.success) {
      // Update user in store
      authStore.user.name = form.value.name
      authStore.user.email = form.value.email
      
      message.value = { text: 'Profile berhasil diupdate!', type: 'success' }
    }
  } catch (error) {
    message.value = { 
      text: error.response?.data?.message || 'Gagal mengupdate profile', 
      type: 'error' 
    }
  } finally {
    isLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    passwordMessage.value = { text: 'Konfirmasi password tidak sama', type: 'error' }
    return
  }

  try {
    isPasswordLoading.value = true
    
    const response = await axios.put('/api/auth/change-password', {
      current_password: passwordForm.value.current_password,
      password: passwordForm.value.new_password,
      password_confirmation: passwordForm.value.new_password_confirmation
    })
    
    if (response.data.success) {
      passwordForm.value = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }
      
      passwordMessage.value = { text: 'Password berhasil diubah!', type: 'success' }
    }
  } catch (error) {
    passwordMessage.value = { 
      text: error.response?.data?.message || 'Gagal mengubah password', 
      type: 'error' 
    }
  } finally {
    isPasswordLoading.value = false
  }
}

const logout = async () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    await authStore.logout()
    router.push({ name: 'login' })
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const clearMessages = () => {
  setTimeout(() => {
    message.value = { text: '', type: '' }
    passwordMessage.value = { text: '', type: '' }
  }, 5000)
}

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name
    form.value.email = authStore.user.email
  }
})

// Clear messages after 5 seconds
const watchMessages = () => {
  if (message.value.text || passwordMessage.value.text) {
    clearMessages()
  }
}
</script>