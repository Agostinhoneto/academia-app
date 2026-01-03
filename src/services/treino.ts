import api from './api';
import { ApiResponse } from '../config/api';

// Tipos de dados de treino
export interface Treino {
  id: number;
  nome: string;
  descricao?: string;
  tipo: string;
  data_inicio: string;
  data_fim?: string;
  observacoes?: string;
  dia_semana?: {
    id: number;
    nome: string;
  };
  grupo_muscular?: {
    id: number;
    nome: string;
  };
  exercicios?: ExercicioTreino[];
}

export interface ExercicioTreino {
  id: number;
  exercicio_id: number;
  series: number;
  repeticoes: string;
  carga?: string;
  observacoes?: string;
  ordem?: number;
  exercicio?: {
    id: number;
    nome: string;
    descricao?: string;
    grupo_muscular?: string;
  };
}

// Serviço de treinos
export const treinoService = {
  // Listar treinos do aluno logado
  async getTreinos(): Promise<Treino[]> {
    const response = await api.get<ApiResponse<Treino[]>>('/mobile/treinos');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar treinos');
  },

  // Obter detalhes de um treino específico
  async getTreinoById(id: number): Promise<Treino> {
    const response = await api.get<ApiResponse<Treino>>(`/mobile/treinos/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar treino');
  },
};
