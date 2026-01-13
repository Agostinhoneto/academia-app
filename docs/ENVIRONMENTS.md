# 🌐 Guia de Ambientes - Local e Produção

## 📋 Índice
1. [Como Trocar de Ambiente](#como-trocar-de-ambiente)
2. [Configuração Local](#configuração-local)
3. [Configuração Produção](#configuração-produção)
4. [Usando Variáveis de Ambiente](#usando-variáveis-de-ambiente)
5. [Troubleshooting](#troubleshooting)

---

## 🔄 Como Trocar de Ambiente

### Método 1: Flag no Código (Recomendado para desenvolvimento)

Abra o arquivo `src/config/api.ts` e altere a linha:

```typescript
const USE_PRODUCTION = false; // true = Produção | false = Local
```

**Para Local (Desenvolvimento):**
```typescript
const USE_PRODUCTION = false; // 💻 Ambiente Local
```

**Para Produção:**
```typescript
const USE_PRODUCTION = true; // ☁️ Ambiente Produção
```

### Método 2: Variável de Ambiente (Recomendado para deploy)

Crie um arquivo `.env` na raiz do projeto:

**Para Local:**
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

**Para Produção:**
```env
REACT_APP_API_URL=https://powerfitacademy.com.br/api
```

---

## 💻 Configuração Local

### Requisitos
- Laravel rodando em `http://127.0.0.1:8000`
- Banco de dados configurado
- Migrations executadas

### Passos

1. **Inicie o servidor Laravel:**
```bash
cd /caminho/do/backend
php artisan serve
```

2. **Configure o ambiente:**
```typescript
// src/config/api.ts
const USE_PRODUCTION = false;
```

3. **Execute o app:**
```bash
npm start
# ou
expo start
```

4. **Verifique o console:**
```
🔧 Ambiente: 💻 LOCAL
🌐 URL: http://127.0.0.1:8000/api
```

### URLs Disponíveis (Local)
```
Base: http://127.0.0.1:8000/api

Login: POST /aluno/login
Treinos: GET /mobile/treinos
Perfil: GET /mobile/profile
Mensalidades: GET /mobile/mensalidades
Notificações: GET /mobile/notifications
```

---

## ☁️ Configuração Produção

### Requisitos
- Servidor online funcionando
- SSL configurado (HTTPS)
- Banco de dados de produção

### Passos

1. **Configure o ambiente:**
```typescript
// src/config/api.ts
const USE_PRODUCTION = true;
```

2. **Execute o app:**
```bash
npm start
# ou
expo start
```

3. **Teste a conexão:**
```
URL: https://powerfitacademy.com.br/api
```

### URLs Disponíveis (Produção)
```
Base: https://powerfitacademy.com.br/api

Login: POST /aluno/login
Treinos: GET /mobile/treinos
Perfil: GET /mobile/profile
Mensalidades: GET /mobile/mensalidades
Notificações: GET /mobile/notifications
```

---

## 🔐 Usando Variáveis de Ambiente

### React Native / Expo

#### 1. Instale o pacote (se necessário):
```bash
npm install react-native-dotenv
# ou
npm install expo-constants
```

#### 2. Crie arquivos `.env`:

**.env.local** (para desenvolvimento):
```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_ENV=local
```

**.env.production** (para produção):
```env
REACT_APP_API_URL=https://powerfitacademy.com.br/api
REACT_APP_ENV=production
```

#### 3. Configure o babel.config.js:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

#### 4. Use no código:
```typescript
import { REACT_APP_API_URL } from '@env';
```

---

## 🧪 Testando os Ambientes

### Teste Local

```bash
# 1. Inicie o Laravel
cd backend
php artisan serve

# 2. Teste o endpoint
curl http://127.0.0.1:8000/api/aluno/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@email.com","password":"123456"}'
```

### Teste Produção

```bash
# Teste o endpoint
curl https://powerfitacademy.com.br/api/aluno/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@email.com","password":"123456"}'
```

---

## ⚠️ Troubleshooting

### Problema: "Network Error" no Local

**Solução:**
1. Verifique se o Laravel está rodando:
```bash
php artisan serve
```

2. Verifique se a URL está correta:
```typescript
local: 'http://127.0.0.1:8000/api'
```

3. Teste diretamente no navegador:
```
http://127.0.0.1:8000/api/aluno/login
```

### Problema: "CORS Error" no Local

**Solução no Laravel:**
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['*'], // ou especifique: ['http://localhost:19006']
```

### Problema: "401 Unauthorized"

**Causas comuns:**
1. Token expirado (60 minutos)
2. Token não enviado no header
3. Token inválido

**Solução:**
```typescript
// Verifique se o token está sendo enviado
console.log('Token:', await AsyncStorage.getItem('token'));

// Faça login novamente
await authService.login(email, password);
```

### Problema: App não atualiza após trocar ambiente

**Solução:**
1. Limpe o cache:
```bash
# React Native
npx react-native start --reset-cache

# Expo
expo start -c
```

2. Reinstale os pacotes:
```bash
rm -rf node_modules
npm install
```

---

## 📊 Comparação de Ambientes

| Característica | Local 💻 | Produção ☁️ |
|----------------|----------|-------------|
| URL | http://127.0.0.1:8000/api | https://powerfitacademy.com.br/api |
| SSL | ❌ HTTP | ✅ HTTPS |
| Banco de Dados | Local | Servidor |
| Debug | ✅ Habilitado | ❌ Desabilitado |
| Cache | ❌ Desabilitado | ✅ Habilitado |
| Log | Console | Arquivo |

---

## 🎯 Melhores Práticas

### ✅ Faça

- Use ambiente LOCAL para desenvolvimento
- Use ambiente PRODUÇÃO apenas para testes finais
- Mantenha credenciais separadas por ambiente
- Teste em PRODUÇÃO antes de publicar
- Use variáveis de ambiente para dados sensíveis

### ❌ Não Faça

- Não commite arquivos `.env` com tokens reais
- Não teste funcionalidades novas direto em PRODUÇÃO
- Não misture dados de LOCAL e PRODUÇÃO
- Não deixe `USE_PRODUCTION = true` ao desenvolver

---

## 🔒 Segurança

### Credenciais de Teste (LOCAL)
```
Email: aluno@email.com
Senha: 123456
```

### Credenciais de Produção
```
⚠️ NUNCA COMPARTILHE CREDENCIAIS REAIS
Use as credenciais fornecidas pelo administrador
```

---

## 📱 Exemplo de Uso Completo

```typescript
// src/screens/LoginScreen.tsx
import { API_CONFIG, ENVIRONMENT } from '../config/api';
import { authService } from '../services/auth';

const LoginScreen = () => {
  const handleLogin = async () => {
    try {
      console.log('🌐 Ambiente:', ENVIRONMENT.name);
      console.log('🔗 URL:', ENVIRONMENT.url);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('❌ Erro:', error);
    }
  };
  
  return (
    <View>
      <Text>Ambiente: {ENVIRONMENT.name}</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
```

---

## 🆘 Suporte

Se ainda tiver problemas:

1. ✅ Verifique os logs do Laravel: `storage/logs/laravel.log`
2. ✅ Teste os endpoints no Postman
3. ✅ Verifique a configuração de CORS
4. ✅ Confirme que o token não expirou
5. ✅ Revise os headers da requisição

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0.0
