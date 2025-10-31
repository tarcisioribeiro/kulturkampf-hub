import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or server not responding
      error.userMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    } else {
      // HTTP errors
      switch (error.response.status) {
        case 400:
          error.userMessage = error.response.data?.detail ||
                              error.response.data?.error ||
                              'Dados inválidos. Verifique as informações enviadas.';
          break;
        case 401:
          error.userMessage = 'Credenciais inválidas ou sessão expirada.';
          break;
        case 403:
          error.userMessage = 'Você não tem permissão para acessar este recurso.';
          break;
        case 404:
          error.userMessage = 'Recurso não encontrado.';
          break;
        case 500:
          error.userMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 503:
          error.userMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
          break;
        default:
          error.userMessage = error.response.data?.detail ||
                              error.response.data?.error ||
                              'Ocorreu um erro inesperado.';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
