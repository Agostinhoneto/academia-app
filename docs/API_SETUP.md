# 🔗 Guia de Integração da API

## 📌 Resumo

A integração com a API está completa! Todos os serviços necessários foram criados e estão prontos para uso.

## ✅ O que foi implementado:

### 1. Configuração da API
- ✅ Axios configurado com interceptores
- ✅ Gerenciamento automático de token JWT
- ✅ Tratamento de erros 401 (token expirado)
- ✅ AsyncStorage para persistência do token

### 2. Serviços Criados

#### **AuthService** (`src/services/auth.ts`)
- `login(email, password)` - Login de aluno
- `logout()` - Logout
- `register(data)` - Registro público
- `refreshToken()` - Renovar token
- `me()` - Dados do usuário atual

#### **AlunoService** (`src/services/aluno.ts`)
- `getProfile()` - Perfil do aluno logado
- `updateProfile(data)` - Atualizar perfil

#### **TreinoService** (`src/services/treino.ts`)
- `getTreinos()` - Listar treinos do aluno
- `getTreinoById(id)` - Detalhes de um treino

#### **MensalidadeService** (`src/services/mensalidade.ts`)
- `getMensalidades()` - Todas as mensalidades
- `getProximaMensalidade()` - Próxima mensalidade a vencer

#### **NotificacaoService** (`src/services/notificacao.ts`)
- `getNotificacoes()` - Listar notificações
- `markAsRead(id)` - Marcar como lida
- `markAllAsRead()` - Marcar todas como lidas

### 3. Context de Autenticação
- ✅ AuthContext criado
- ✅ Hook `useAuth()` disponível
- ✅ Estado global de autenticação
- ✅ Persistência de sessão

## 🚀 Como usar:

### Exemplo de Login
```typescript
import { useAuth } from '../contexts/AuthContext';

function LoginScreen() {
  const { login, loading } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({
        email: 'aluno@academia.com',
        password: '123456'
      });
      // Navegar para tela principal
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };
}
```

### Exemplo de Uso em Telas
```typescript
import { useAuth } from '../contexts/AuthContext';
import { treinoService } from '../services/treino';

function HomeScreen() {
  const { user, aluno } = useAuth();
  const [treinos, setTreinos] = useState([]);
  
  useEffect(() => {
    loadTreinos();
  }, []);
  
  async function loadTreinos() {
    try {
      const data = await treinoService.getTreinos();
      setTreinos(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <View>
      <Text>Olá, {user?.name}!</Text>
      {/* Renderizar treinos */}
    </View>
  );
}
```

## ⚙️ Configuração do Backend

### Base URL
Por padrão, a API aponta para `http://localhost/api`.

Para alterar (em `src/config/api.ts`):
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://sua-api.com/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

## 📱 Teste de Integração

### 1. Certifique-se de que a API está rodando
```bash
# Se estiver usando Laravel, por exemplo:
php artisan serve
```

### 2. Credenciais de Teste
- **Email**: aluno@academia.com
- **Senha**: 123456 (senha padrão de alunos criados pelo dashboard)

### 3. Teste o Login
Execute o app e faça login com as credenciais acima.

## 🔍 Debugging

### Verificar Token Salvo
```typescript
import { tokenManager } from '../services/api';

const token = await tokenManager.getToken();
console.log('Token:', token);
```

### Ver Requisições
Adicione log no interceptor (temporariamente):
```typescript
// Em src/services/api.ts
api.interceptors.request.use(
  async (config) => {
    console.log('📡 Request:', config.method?.toUpperCase(), config.url);
    // ...
  }
);
```

## 📋 Próximos Passos

1. **Atualizar LoginScreen** para usar o hook `useAuth()`
2. **Atualizar HomeScreen** para buscar dados reais da API
3. **Atualizar ProfileScreen** para exibir dados do perfil
4. **Atualizar WorkoutsScreen** para listar treinos reais
5. **Atualizar PlanScreen** para exibir dados de mensalidade
6. **Adicionar loading states** em todas as telas
7. **Adicionar tratamento de erros** robusto
8. **Implementar pull-to-refresh**

## 🐛 Troubleshooting

### Erro de CORS
Se estiver testando em web, pode precisar configurar CORS no backend Laravel.

### Erro de Network Request Failed
- Verifique se a API está rodando
- Em Android, use o IP da máquina ao invés de localhost
- Em iOS simulator, localhost deve funcionar

### Token não persiste
- Verifique se o AsyncStorage está instalado corretamente
- Execute: `npx expo install @react-native-async-storage/async-storage`

## 📚 Documentação Adicional

- [API Integration Guide](./API_INTEGRATION.md) - Detalhes técnicos
- [OpenAPI Spec](../openapi.json) - Especificação completa da API

## 🎉 Pronto!

Toda a estrutura de integração está pronta. Agora é só começar a usar os serviços nas telas do app!
