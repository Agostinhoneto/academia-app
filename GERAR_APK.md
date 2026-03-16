# Como Gerar e Compartilhar o APK do App

## Método 1: EAS Build (Recomendado - Mais Fácil)

### Passo 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Passo 2: Fazer Login na Conta Expo
```bash
eas login
```
- Se não tiver conta, crie em: https://expo.dev/signup
- Digite seu email e senha

### Passo 3: Configurar o Projeto
```bash
eas build:configure
```
- Vai criar o arquivo `eas.json` automaticamente
- Aperte Enter para aceitar as configurações padrão

### Passo 4: Gerar o APK
```bash
eas build --platform android --profile preview
```
- Escolha a opção para gerar APK (não AAB)
- Aguarde o build terminar (demora 5-15 minutos)
- No final, você receberá um **link de download**

### Passo 5: Compartilhar o APK
Você tem 3 opções:

**Opção A:** Compartilhar o link direto
- Copie o link que apareceu no terminal
- Envie para a pessoa via WhatsApp/Email/Telegram

**Opção B:** Baixar e enviar o arquivo
- Acesse o link e baixe o APK
- Envie o arquivo `.apk` por WhatsApp, Google Drive, etc.

**Opção C:** Acessar pelo site Expo
- Entre em: https://expo.dev/accounts/[seu-usuario]/projects/academia-app/builds
- Baixe o APK e compartilhe

---

## Método 2: Build Local (Mais Complexo)

### Pré-requisitos
- Android Studio instalado
- SDK do Android configurado

### Passo 1: Instalar Dependências
```bash
npx expo install expo-dev-client
npx expo prebuild
```

### Passo 2: Gerar APK
```bash
cd android
./gradlew assembleRelease
```

### Passo 3: Localizar o APK
O arquivo estará em:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Passo 4: Compartilhar
- Envie o arquivo `app-release.apk` para a pessoa

---

## Como a Pessoa Instala o APK?

1. **Baixar o arquivo APK** no celular Android
2. **Abrir o arquivo** (vai aparecer um aviso de segurança)
3. **Permitir instalação de apps desconhecidos**:
   - Vá em Configurações → Segurança → Fontes Desconhecidas
   - Ou quando tentar instalar, aparecerá a opção para permitir
4. **Instalar o app**
5. **Pronto!** O app estará disponível na tela inicial

---

## Dicas Importantes

✅ **Use o Método 1 (EAS Build)** - É mais simples e não precisa configurar nada localmente

✅ **O link do APK expira em 30 dias** - Se precisar compartilhar depois, faça um novo build

✅ **Certifique-se que a pessoa tem Android** - APK não funciona em iOS

✅ **O arquivo APK fica grande** (30-80 MB) - Use Google Drive ou Dropbox se for enviar por email

---

## Problemas Comuns

**"Command not found: eas"**
- Rode: `npm install -g eas-cli`

**"You need to be logged in"**
- Rode: `eas login`

**"Build failed"**
- Verifique se o `package.json` está correto
- Rode: `npm install` antes de tentar novamente

**Pessoa não consegue instalar**
- Peça para ela permitir "Fontes Desconhecidas" nas configurações
- Alguns celulares bloqueiam instalação de APK por padrão
