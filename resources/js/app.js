import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './components/App.vue';
import router from './router';

// Axios configuration for Laravel backend
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add CSRF token if available
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Create Pinia store
const pinia = createPinia();

// Create Vue app
const app = createApp(App);
app.use(pinia);
app.use(router);

// Global properties
app.config.globalProperties.$axios = axios;

console.log('Vue app initializing...');
app.mount('#app');
console.log('Vue app mounted successfully!');
