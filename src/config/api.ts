// Configuração da API
// No iOS/Android físico, não use localhost. Use o IP da sua máquina.
// Para desenvolvimento local, coloque o IP do seu computador aqui
const getBaseURL = () => {
  // Se estiver rodando na web, usa localhost
  if (typeof window !== 'undefined' && window.location) {
    return 'http://localhost/api';
  }
  
  // No iOS/Android, use o IP da sua máquina
  return 'http://192.168.1.222/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
}
