// Configuração da API
// URL de produção do servidor
const PRODUCTION_URL = 'https://powerfitacademy.com.br/api';

// Para desenvolvimento local, descomente e coloque o IP da sua máquina:
// const DEV_URL = 'http://192.168.1.222/api';

const getBaseURL = () => {
  // Usar sempre a URL de produção
  return PRODUCTION_URL;
  
  // Para desenvolvimento local, descomente a linha abaixo:
  // return DEV_URL;
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
