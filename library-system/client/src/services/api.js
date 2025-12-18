import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy handles this to localhost:3000
});

export default api;
