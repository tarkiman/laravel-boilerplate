import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set base URL for Laravel API
axios.defaults.baseURL = 'http://localhost:8000';
