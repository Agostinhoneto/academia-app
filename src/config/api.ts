// ==============================
// 🔧 CONFIGURAÇÃO DE AMBIENTES
// ==============================

// 🎯 ESCOLHA O PERFIL AQUI:
type Environment = 'local-web' | 'local-mobile' | 'production';

const CURRENT_ENVIRONMENT: Environment = 'production'; // 👈 ALTERE AQUI!

// 📋 PERFIS DISPONÍVEIS:
// 'local-web'      → Local no navegador (localhost/api)
// 'local-mobile'   → Local no celular (192.168.1.222/api)  
// 'production'     → Produção (powerfitacademy.com.br/api)

// ⚠️ IMPORTANTE - DEPENDÊNCIAS:
// 
// 💻 LOCAL - Precisa:
//    ✅ Docker rodando (banco de dados)
//    ✅ XAMPP/WAMP rodando (Laravel)
//    ✅ Mesma rede WiFi (para celular físico)
//
// ☁️ PRODUÇÃO - Precisa:
//    ✅ Apenas internet
//    ✅ Funciona de qualquer lugar
//    ✅ Não depende de Docker/XAMPP

// 🌐 URLs dos ambientes
const ENVIRONMENT_URLS = {
  'local-web': 'http://localhost/api',
  'local-mobile': 'http://192.168.1.222/api',
  'production': 'https://powerfitacademy.com.br/api',
};

// 🚀 Determinar URL base
const getBaseURL = () => {
  // 1️⃣ Variável de ambiente (prioridade máxima)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 2️⃣ Baseado no perfil selecionado
  return ENVIRONMENT_URLS[CURRENT_ENVIRONMENT];
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
  name: CURRENT_ENVIRONMENT,
  url: getBaseURL(),
  isProduction: CURRENT_ENVIRONMENT === 'production',
  isDevelopment: CURRENT_ENVIRONMENT !== 'production',
  profile: CURRENT_ENVIRONMENT,
};

// 🔍 Log do ambiente (sempre mostra para facilitar debug)
console.log('🔧 Ambiente:', CURRENT_ENVIRONMENT);
console.log('🌐 URL:', getBaseURL());

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
