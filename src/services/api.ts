import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// Chave para armazenar o token
const TOKEN_KEY = '@academia_token';

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Interceptor de requisição para adicionar o token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    
    if (token) {
      console.log('🔑 Token recuperado (primeiros 30 chars):', token.substring(0, 30) + '...');
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Authorization header definido:', config.headers.Authorization.substring(0, 40) + '...');
      }
    } else {
      console.log('❌ NENHUM TOKEN ENCONTRADO no AsyncStorage!');
    }
    
    console.log('🌐 Requisição:', config.method?.toUpperCase(), config.url);
    console.log('📋 Headers completos:', JSON.stringify(config.headers, null, 2));
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpar storage e redirecionar para login
      await AsyncStorage.removeItem(TOKEN_KEY);
      // Você pode emitir um evento aqui para que o contexto de autenticação saiba
    }
    
    return Promise.reject(error);
  }
);

// Funções auxiliares para gerenciar o token
export const tokenManager = {
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
  
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};

export default api;
