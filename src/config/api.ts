// ==============================
// 🔧 CONFIGURAÇÃO DE AMBIENTES
// ==============================

// 🎯 ALTERE AQUI PARA TROCAR ENTRE LOCAL E PRODUÇÃO
const USE_PRODUCTION = false; // true = Produção ☁️ | false = Local 💻

// 📱 CONFIGURAÇÃO PARA DESENVOLVIMENTO LOCAL
// ⚠️ IMPORTANTE: Escolha a URL correta baseado em onde está testando!

const LOCAL_URLS = {
  // 💻 Emulador/Simulador (mesma máquina)
  emulator: 'http://127.0.0.1/api',
  
  // 📱 Celular Físico (mesma rede WiFi)
  // ⚠️ SUBSTITUA pelo IP da sua máquina! Execute: ipconfig (Windows) ou ifconfig (Mac/Linux)
  physical: 'http://192.168.1.222/api', // 🔴 ALTERE AQUI SEU IP!
  
  // 🌐 Web Browser
  web: 'http://localhost/api',
};

// 🌐 URLs dos ambientes
const API_URLS = {
  production: 'https://powerfitacademy.com.br/api',
  
  // 🎯 ESCOLHA O LOCAL URL BASEADO NO SEU TESTE:
  // - Usando emulador/simulador? Use LOCAL_URLS.emulator
  // - Usando celular físico? Use LOCAL_URLS.physical (e configure o IP!)
  // - Usando navegador web? Use LOCAL_URLS.web
  local: LOCAL_URLS.physical, // 🔧 ALTERE AQUI!
};

// 🚀 Determinar URL base
const getBaseURL = () => {
  // 1️⃣ Variável de ambiente (prioridade máxima)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 2️⃣ Baseado na flag USE_PRODUCTION
  return USE_PRODUCTION ? API_URLS.production : API_URLS.local;
};

// ⚙️ Configuração exportada
export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// 📊 Informações do ambiente atual
export const ENVIRONMENT = {
  name: USE_PRODUCTION ? '☁️ PRODUÇÃO' : '💻 LOCAL',
  url: getBaseURL(),
  isProduction: USE_PRODUCTION,
  isDevelopment: !USE_PRODUCTION,
};

// 🔍 Log do ambiente (apenas em desenvolvimento)
if (!USE_PRODUCTION) {
  console.log('🔧 Ambiente:', ENVIRONMENT.name);
  console.log('🌐 URL:', ENVIRONMENT.url);
}

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
