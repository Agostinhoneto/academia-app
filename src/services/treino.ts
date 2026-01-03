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
  nome: string;
  descricao?: string;
  equipamento?: string;
  video_url?: string;
  imagem?: string;
  tipo?: string;
  pivot?: {
    treino_id: number;
    exercicio_id: number;
    series: number;
    repeticoes: number;
    carga: number;
  };
}

// Serviço de treinos
export const treinoService = {
  // Listar treinos do aluno logado
  async getTreinos(): Promise<Treino[]> {
    console.log('🌐 Chamando GET /mobile/treinos');
    const response = await api.get<ApiResponse<Treino[]>>('/mobile/treinos');
    console.log('📥 Resposta getTreinos:', response.data);
    
    if (response.data.success && response.data.data) {
      console.log('✅ getTreinos retornou', response.data.data.length, 'treinos');
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar treinos');
  },

  // Obter detalhes de um treino específico
  async getTreinoById(id: number): Promise<Treino> {
    console.log('🌐 Chamando GET /mobile/treinos/' + id);
    
    // Verificar se o token está sendo enviado
    const token = await import('./api').then(m => m.tokenManager.getToken());
    console.log('🔑 Token atual:', token ? 'Token existe (primeiros 20 chars): ' + token.substring(0, 20) + '...' : 'SEM TOKEN');
    
    const response = await api.get(`/mobile/treinos/${id}`);
    
    console.log('📥 Resposta recebida:', response.data);
    
    // Verificar se a resposta tem o formato {success, data}
    if (response.data.success && response.data.data) {
      console.log('✅ Formato: {success, data}');
      return response.data.data;
    }
    
    // Se não, retornar diretamente os dados
    if (response.data) {
      console.log('✅ Formato: dados diretos');
      return response.data;
    }
    
    throw new Error('Erro ao buscar treino');
  },

  // Finalizar treino
  async finalizarTreino(treinoId: number): Promise<void> {
    console.log('🎯 Finalizando treino:', treinoId);
    const response = await api.post(`/mobile/treinos/${treinoId}/finalizar`);
    console.log('✅ Treino finalizado:', response.data);
  },
};
