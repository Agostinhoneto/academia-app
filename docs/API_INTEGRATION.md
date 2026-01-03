# Integração com API - Academia App

## 📋 Visão Geral

Este documento descreve como a integração com a API foi implementada no aplicativo da academia.

## 🔧 Estrutura de Arquivos

```
src/
├── config/
│   └── api.ts                 # Configurações da API
├── services/
│   ├── api.ts                 # Instância configurada do axios
│   ├── auth.ts                # Serviços de autenticação
│   ├── aluno.ts               # Serviços do perfil do aluno
│   ├── treino.ts              # Serviços de treinos
│   ├── mensalidade.ts         # Serviços de mensalidades
│   └── notificacao.ts         # Serviços de notificações
└── contexts/
    └── AuthContext.tsx        # Contexto de autenticação
```

## 🔐 Autenticação

### Login
```typescript
import { useAuth } from '../contexts/AuthContext';

const { login } = useAuth();

await login({
  email: 'aluno@academia.com',
  password: '123456'
});
```

### Logout
```typescript
const { logout } = useAuth();
await logout();
```

### Verificar se está autenticado
```typescript
const { signed, user, aluno } = useAuth();

if (signed) {
  console.log('Usuário logado:', user.name);
  console.log('Aluno:', aluno.nome);
}
```

## 📡 Endpoints Disponíveis

### Autenticação
- `POST /api/aluno/login` - Login de aluno
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Renovar token
- `GET /auth/me` - Dados do usuário autenticado

### Perfil do Aluno
- `GET /mobile/profile` - Obter perfil do aluno logado
- `PUT /mobile/profile` - Atualizar perfil do aluno

### Treinos
- `GET /mobile/treinos` - Listar treinos do aluno logado
- `GET /treinos/{id}` - Detalhes de um treino específico

### Mensalidades
- `GET /api/mobile/mensalidades` - Listar todas as mensalidades
- `GET /api/mobile/mensalidades/proxima` - Próxima mensalidade a vencer

### Notificações
- `GET /mobile/notifications` - Listar notificações do aluno
- `PUT /mobile/notifications/{id}/read` - Marcar como lida
- `PUT /mobile/notifications/mark-all-read` - Marcar todas como lidas

## 🎯 Exemplos de Uso

### Buscar Treinos
```typescript
import { treinoService } from '../services/treino';

const treinos = await treinoService.getTreinos();
console.log('Treinos:', treinos);
```

### Buscar Mensalidades
```typescript
import { mensalidadeService } from '../services/mensalidade';

// Todas as mensalidades
const mensalidades = await mensalidadeService.getMensalidades();

// Próxima mensalidade
const proxima = await mensalidadeService.getProximaMensalidade();
```

### Buscar Notificações
```typescript
import { notificacaoService } from '../services/notificacao';

const { data, meta } = await notificacaoService.getNotificacoes();
console.log('Notificações não lidas:', meta.unread_count);
```

## ⚙️ Configuração

### Base URL da API
Por padrão, a API está configurada para `http://localhost/api`.

Para alterar:
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://sua-api.com/api',
  // ...
};
```

### Token JWT
O token é armazenado automaticamente no AsyncStorage e adicionado em todas as requisições através de um interceptor do axios.

## 🚀 Próximos Passos

1. Integrar os serviços nas telas existentes
2. Adicionar estados de loading e erro
3. Implementar refresh de dados
4. Adicionar tratamento de erros mais robusto
5. Implementar cache de dados offline

## 📝 Notas Importantes

- Todos os endpoints mobile requerem autenticação (Bearer Token)
- O token expira em 3600 segundos (1 hora)
- Erros 401 limpam o token automaticamente e redirecionam para login
- Senha padrão de alunos criados pelo dashboard: `123456`
