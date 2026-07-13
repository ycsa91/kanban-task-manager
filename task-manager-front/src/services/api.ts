import axios from 'axios';

const api = axios.create({
  // Reemplazamos el string fijo por la variable de entorno nativa de Vite
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;