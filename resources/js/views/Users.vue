<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <button 
        @click="showCreateModal = true"
        class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Add User
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ user.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                v-for="role in user.roles" 
                :key="role.id"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1"
              >
                {{ role.name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="editUser(user)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Edit
              </button>
              <button 
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium mb-4">
          {{ showCreateModal ? 'Create User' : 'Edit User' }}
        </h3>
        
        <form @submit.prevent="showCreateModal ? createUser() : updateUser()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              v-model="userForm.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              v-model="userForm.email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div v-if="showCreateModal" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              v-model="userForm.password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Roles</label>
            <select multiple v-model="userForm.role_ids" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              {{ showCreateModal ? 'Create' : 'Update' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const availableRoles = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const userForm = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role_ids: []
});

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    users.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get('/api/roles');
    availableRoles.value = response.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const createUser = async () => {
  try {
    await axios.post('/api/users', userForm.value);
    fetchUsers();
    closeModal();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const editUser = (user) => {
  userForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role_ids: user.roles.map(role => role.id)
  };
  showEditModal.value = true;
};

const updateUser = async () => {
  try {
    await axios.put(`/api/users/${userForm.value.id}`, userForm.value);
    fetchUsers();
    closeModal();
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  userForm.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role_ids: []
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>