import api from './api';
import { ApiResponse } from '../config/api';

// Tipos de dados de mensalidade
export interface Mensalidade {
  id: number;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'vencido';
  mes_referencia: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  matricula?: {
    id: number;
    plano: {
      nome: string;
      valor: number;
    };
  };
}

export interface ProximaMensalidade extends Mensalidade {
  dias_para_vencimento: number;
}

// Serviço de mensalidades
export const mensalidadeService = {
  // Listar todas as mensalidades do aluno logado
  async getMensalidades(): Promise<Mensalidade[]> {
    const response = await api.get<ApiResponse<Mensalidade[]>>(
      '/api/mobile/mensalidades'
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar mensalidades');
  },

  // Obter próxima mensalidade a vencer
  async getProximaMensalidade(): Promise<ProximaMensalidade | null> {
    try {
      const response = await api.get<ApiResponse<ProximaMensalidade>>(
        '/api/mobile/mensalidades/proxima'
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error: any) {
      // Se não houver mensalidade pendente, retorna null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
