import api, { tokenManager } from './api';
import { ApiResponse } from '../config/api';

// Tipos de dados de autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  aluno: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    data_nascimento?: string;
    genero?: string;
    status: string;
    objetivo?: string;
  };
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: 'masculino' | 'feminino' | 'outro';
  cpf?: string;
  rg?: string;
  objetivo?: string;
}

// Serviço de autenticação
export const authService = {
  // Login de aluno
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/aluno/login',
      credentials
    );
    
    console.log('📥 Resposta do login:', response.data);
    
    if (response.data.success && response.data.access_token) {
      // Salvar o token
      await tokenManager.setToken(response.data.access_token);
      console.log('💾 Token salvo com sucesso');
      
      // Verificar se foi salvo
      const savedToken = await tokenManager.getToken();
      console.log('✅ Token verificado:', savedToken ? 'Token salvo corretamente' : 'ERRO: Token não foi salvo!');
      
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao fazer login');
  },

  // Registro público de aluno
  async register(data: RegisterData): Promise<any> {
    const response = await api.post<ApiResponse>('/aluno/register', data);
    
    if (response.data.success) {
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao registrar');
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Sempre remover o token local
      await tokenManager.removeToken();
    }
  },

  // Renovar token
  async refreshToken(): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/refresh');
    
    if (response.data.success && response.data.access_token) {
      await tokenManager.setToken(response.data.access_token);
      return response.data;
    }
    
    throw new Error('Erro ao renovar token');
  },

  // Obter usuário autenticado
  async me(): Promise<any> {
    const response = await api.get<ApiResponse>('/auth/me');
    
    if (response.data.success) {
      return response.data.user;
    }
    
    throw new Error('Erro ao obter dados do usuário');
  },

  // Verificar se está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },
};
