import api from './api';
import { ApiResponse, PaginatedResponse } from '../config/api';

// Tipos de dados de notificação
export interface Notificacao {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'normal' | 'high';
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificacoesResponse {
  data: PaginatedResponse<Notificacao>;
  meta: {
    unread_count: number;
    total_count: number;
  };
}

// Serviço de notificações
export const notificacaoService = {
  // Listar notificações do aluno logado
  async getNotificacoes(
    page: number = 1,
    perPage: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificacoesResponse> {
    const response = await api.get<ApiResponse<NotificacoesResponse>>(
      '/mobile/notifications',
      {
        params: {
          page,
          per_page: perPage,
          unread_only: unreadOnly,
        },
      }
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Erro ao buscar notificações');
  },

  // Marcar notificação como lida
  async markAsRead(id: number): Promise<void> {
    await api.put(`/mobile/notifications/${id}/read`);
  },

  // Marcar todas como lidas
  async markAllAsRead(): Promise<void> {
    await api.put('/mobile/notifications/mark-all-read');
  },
};
