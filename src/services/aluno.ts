import api from './api';
import { ApiResponse } from '../config/api';

// Tipos de dados do aluno
export interface AlunoProfile {
  user: {
    id: number;
    name: string;
    email: string;
    telefone?: string;
    data_nascimento?: string;
    genero?: string;
  };
  aluno: {
    id: number;
    nome: string;
    cpf: string;
    objetivo?: string;
    status: string;
  };
}

export interface UpdateProfileData {
  telefone?: string;
  objetivo?: string;
  genero?: 'masculino' | 'feminino' | 'outro';
}

// Serviço de perfil do aluno
export const alunoService = {
  // Obter perfil do aluno logado
  async getProfile(): Promise<AlunoProfile> {
    const response = await api.get<ApiResponse<AlunoProfile>>('/mobile/profile');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar perfil');
  },

  // Atualizar perfil do aluno
  async updateProfile(data: UpdateProfileData): Promise<void> {
    const response = await api.put<ApiResponse>('/mobile/profile', data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao atualizar perfil');
    }
  },
};
