# 📦 Como Fazer Build Nativo (APK/IPA)

## 🎯 Objetivo

Criar um app instalável que funciona **SEM** precisar do `npm start` rodando.

---

## 🔄 Comparação:

| Modo | Precisa npm start? | Instala? | Testa Local? | Usa Produção? |
|------|-------------------|----------|--------------|---------------|
| **Expo Go** | ✅ SIM | ❌ Não | ✅ SIM | ✅ SIM |
| **Build Nativo** | ❌ NÃO | ✅ SIM | ⚠️ Difícil | ✅ SIM |

---

## 🚀 Método 1: EAS Build (Recomendado)

### Passo 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Passo 2: Login no Expo
```bash
eas login
```
Use sua conta do Expo ou crie uma em: https://expo.dev

### Passo 3: Configurar o Projeto
```bash
eas build:configure
```

### Passo 4: Garantir Ambiente Produção

**IMPORTANTE:** Antes do build, configure para PRODUÇÃO em `src/config/api.ts`:
```typescript
const CURRENT_ENVIRONMENT: Environment = 'production';
```

### Passo 5: Build Android (APK para instalar)
```bash
eas build --platform android --profile preview
```
Aguarde ~10-20 minutos. No final, você recebe um link para baixar o APK.

### Passo 6: Build iOS (TestFlight)
```bash
eas build --platform ios --profile preview
```

---

## 🏗️ Método 2: Build Local (Mais Rápido)

### Passo 1: Pré-requisitos

**Para Android:**
- Android Studio instalado
- Java JDK 11+

**Para iOS:**
- Mac com Xcode
- Conta Apple Developer

### Passo 2: Preparar Ambiente Produção

Em `src/config/api.ts`:
```typescript
const CURRENT_ENVIRONMENT: Environment = 'production';
```

### Passo 3: Build Android Local
```bash
# Gerar arquivos nativos
npx expo prebuild --clean

# Build APK
npx expo run:android --variant release
```

O APK estará em:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Passo 4: Instalar no Celular

**Método 1: Via cabo USB**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Método 2: Transferir arquivo**
- Envie o APK por email/WhatsApp/Drive
- Abra no celular
- Permita "Instalar de fontes desconhecidas"
- Instale

---

## 🎯 Workflow Recomendado

### 📱 Durante Desenvolvimento:

1. **Use Expo Go** (mais rápido)
```bash
npm start
```

2. **Teste Local** quando necessário:
```typescript
const CURRENT_ENVIRONMENT: Environment = 'local-web'; // ou local-mobile
```
- Ligue Docker + XAMPP
- Teste mudanças no backend

3. **Teste Produção** antes de buildar:
```typescript
const CURRENT_ENVIRONMENT: Environment = 'production';
```
- Desliga Docker (opcional)
- Valida que tudo funciona

### 📦 Para Publicar:

4. **Build Nativo**:
```typescript
const CURRENT_ENVIRONMENT: Environment = 'production'; // SEMPRE!
```
```bash
eas build --platform android --profile preview
```

5. **Distribua o APK/IPA**
- Instale no celular
- Funciona SEM npm start
- Funciona SEM computador

---

## 📋 Checklist Antes do Build

- [ ] `CURRENT_ENVIRONMENT` está como `'production'`
- [ ] API de produção está funcionando
- [ ] Testou login, treinos, perfil em produção
- [ ] app.json configurado (name, version, package)
- [ ] Ícone e splash screen configurados

---

## 🔧 Configurações Importantes

### app.json - Configurar antes do build:

```json
{
  "expo": {
    "name": "PowerFit Academy",
    "slug": "powerfit-academy",
    "version": "1.0.0",
    "android": {
      "package": "com.powerfit.academy",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "ios": {
      "bundleIdentifier": "com.powerfit.academy",
      "buildNumber": "1.0.0"
    }
  }
}
```

---

## ⚡ Resposta Rápida às Suas Perguntas

### 1. "Preciso testar localmente"
✅ **Solução:** Use Expo Go com perfil `local-web` ou `local-mobile`
```typescript
const CURRENT_ENVIRONMENT: Environment = 'local-web';
```
```bash
npm start
```

### 2. "App funciona sem Docker"
✅ **Sim!** Use perfil `production`
```typescript
const CURRENT_ENVIRONMENT: Environment = 'production';
```
```bash
npm start  # Ainda precisa para Expo Go
```

### 3. "App funciona sem npm start"
❌ **Expo Go NÃO!**  
✅ **Build Nativo SIM!**
```bash
eas build --platform android --profile preview
```
Instale o APK gerado → Funciona sem npm start

---

## 🎯 Resumo dos Cenários

| Quero | Use | Precisa Docker? | Precisa npm start? |
|-------|-----|----------------|-------------------|
| Testar backend local | `local-web` + Expo Go | ✅ SIM | ✅ SIM |
| Testar em produção | `production` + Expo Go | ❌ NÃO | ✅ SIM |
| App instalável | `production` + Build | ❌ NÃO | ❌ NÃO |

---

## 🆘 Comandos Resumidos

### Desenvolvimento (Expo Go):
```bash
npm start
# Troca entre local-web, local-mobile, production no código
```

### Build Android (APK):
```bash
# Configurar api.ts para production
eas build --platform android --profile preview
# Baixa APK e instala
```

### Build iOS:
```bash
# Configurar api.ts para production
eas build --platform ios --profile preview
# Usa TestFlight
```

---

**Última atualização:** Janeiro 2026
