# 📱 Configuração de Rede - Testar em Celular Físico

## ❓ O App Funciona de Qualquer Lugar?

### ✅ SIM - Em Produção
Quando `USE_PRODUCTION = true`, o app usa:
```
https://powerfitacademy.com.br/api
```
✅ Funciona de **QUALQUER LUGAR** com internet

### ⚠️ DEPENDE - Em Desenvolvimento Local
Quando `USE_PRODUCTION = false`, depende de onde você está testando:

| Dispositivo | Funciona com 127.0.0.1? | Solução |
|-------------|-------------------------|---------|
| 💻 **Emulador Android** | ✅ SIM | Use `127.0.0.1` ou `10.0.2.2` |
| 📱 **iPhone Simulador** | ✅ SIM | Use `127.0.0.1` ou `localhost` |
| 🌐 **Navegador Web** | ✅ SIM | Use `localhost` |
| 📱 **Celular Físico** | ❌ NÃO | Use **IP da rede local** |

---

## 🔧 Configuração para Celular Físico

### Passo 1: Descobrir o IP da Sua Máquina

#### Windows (PowerShell):
```powershell
ipconfig
```

Procure por:
```
Adaptador de Rede sem Fio Wi-Fi:
   Endereço IPv4. . . . . . . . : 192.168.1.100  👈 ESTE É O IP!
```

#### Mac/Linux (Terminal):
```bash
ifconfig | grep "inet "
# ou
ip addr show
```

Procure por algo como:
```
inet 192.168.1.100  👈 ESTE É O IP!
```

#### Método Rápido (qualquer SO):
1. Conecte-se à mesma rede WiFi (computador e celular)
2. Execute o comando do seu sistema operacional
3. Copie o endereço IP que começa com `192.168.x.x` ou `10.0.x.x`

---

### Passo 2: Configurar o App

Abra: [src/config/api.ts](../src/config/api.ts)

```typescript
const LOCAL_URLS = {
  emulator: 'http://127.0.0.1:8000/api',
  
  // 📱 ALTERE AQUI COM SEU IP!
  physical: 'http://192.168.1.100:8000/api', // 🔴 Cole seu IP aqui!
  
  web: 'http://localhost:8000/api',
};

const API_URLS = {
  production: 'https://powerfitacademy.com.br/api',
  
  // 🔧 ESCOLHA A URL CORRETA:
  local: LOCAL_URLS.physical, // 👈 Para celular físico
  // local: LOCAL_URLS.emulator, // 👈 Para emulador
  // local: LOCAL_URLS.web, // 👈 Para navegador
};
```

---

### Passo 3: Configurar o Laravel para Aceitar Conexões Externas

Por padrão, `php artisan serve` só aceita conexões locais.

#### Opção 1: Servir em Todas as Interfaces
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

#### Opção 2: Servir no IP Específico
```bash
php artisan serve --host=192.168.1.100 --port=8000
```

---

### Passo 4: Configurar Firewall (Windows)

O Windows pode bloquear conexões externas. Permita o Laravel:

1. **Abra o Firewall do Windows**
   - Pesquise "Firewall" no menu iniciar
   - Clique em "Permitir um aplicativo pelo Firewall"

2. **Adicione o PHP**
   - Clique em "Alterar configurações"
   - Clique em "Permitir outro aplicativo"
   - Procure por: `C:\php\php.exe` (ou onde está instalado)
   - Marque "Redes privadas"

#### Ou via PowerShell (Admin):
```powershell
# Permitir porta 8000
netsh advfirewall firewall add rule name="Laravel Dev Server" dir=in action=allow protocol=TCP localport=8000
```

---

### Passo 5: Testar a Conexão

#### Teste 1: Do próprio computador
```bash
curl http://192.168.1.100:8000/api/aluno/login
```

#### Teste 2: Do navegador do celular
```
http://192.168.1.100:8000
```

Se abrir a página do Laravel = ✅ Funcionou!

---

## 🎯 Cenários de Uso

### 1️⃣ Desenvolvimento no Emulador
```typescript
const USE_PRODUCTION = false;
const API_URLS = {
  local: LOCAL_URLS.emulator, // 127.0.0.1
};
```

**Comando:**
```bash
php artisan serve
npm start
# Pressione 'a' para Android ou 'i' para iOS
```

---

### 2️⃣ Teste no Celular Físico (Expo Go)
```typescript
const USE_PRODUCTION = false;
const API_URLS = {
  local: LOCAL_URLS.physical, // 192.168.1.100
};
```

**Comandos:**
```bash
# Terminal 1: Laravel
php artisan serve --host=0.0.0.0

# Terminal 2: Expo
npm start
# Escaneie o QR Code no Expo Go
```

**Requisitos:**
- ✅ Computador e celular na mesma rede WiFi
- ✅ IP configurado corretamente
- ✅ Firewall permitindo conexões
- ✅ Laravel servindo em 0.0.0.0

---

### 3️⃣ Teste no Navegador Web
```typescript
const USE_PRODUCTION = false;
const API_URLS = {
  local: LOCAL_URLS.web, // localhost
};
```

**Comandos:**
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Expo
npm run web
```

---

### 4️⃣ Produção (Funciona de Qualquer Lugar!)
```typescript
const USE_PRODUCTION = true;
// Usa automaticamente: https://powerfitacademy.com.br/api
```

**Comando:**
```bash
npm start
# Funciona em emulador, celular físico, web - TUDO! 🎉
```

---

## 🐛 Troubleshooting

### Problema: "Network Error" no Celular

**Checklist:**
- [ ] Computador e celular na mesma rede WiFi?
- [ ] IP configurado corretamente no `api.ts`?
- [ ] Laravel servindo com `--host=0.0.0.0`?
- [ ] Firewall permitindo a porta 8000?
- [ ] Testou a URL no navegador do celular?

**Teste rápido:**
```bash
# No celular, abra o navegador e acesse:
http://SEU_IP:8000

# Deve abrir a página do Laravel
```

---

### Problema: "Connection Refused"

**Causa:** Laravel não está aceitando conexões externas.

**Solução:**
```bash
# Pare o servidor atual (Ctrl+C)

# Inicie com:
php artisan serve --host=0.0.0.0 --port=8000
```

---

### Problema: Firewall Bloqueando

**Windows:**
```powershell
# Verifique se a porta está bloqueada:
netstat -an | findstr :8000

# Adicione regra de firewall:
netsh advfirewall firewall add rule name="Laravel" dir=in action=allow protocol=TCP localport=8000
```

**Mac:**
```bash
# Firewall geralmente não bloqueia em desenvolvimento
# Se necessário, vá em: System Preferences > Security & Privacy > Firewall
```

---

### Problema: IP Mudou

**Causa:** IPs dinâmicos mudam quando você reconecta ao WiFi.

**Solução Temporária:**
```typescript
// Atualize o IP em api.ts
physical: 'http://192.168.1.XXX:8000/api', // Novo IP
```

**Solução Permanente:**
Configure IP estático no roteador para sua máquina.

---

## 📊 Comparação de URLs

| URL | Onde Funciona | Quando Usar |
|-----|---------------|-------------|
| `127.0.0.1` | Mesma máquina | Emulador, Navegador |
| `localhost` | Mesma máquina | Navegador, iOS Simulator |
| `10.0.2.2` | Android Emulator | Alternativa para emulador Android |
| `192.168.x.x` | Rede local | Celular físico (Expo Go) |
| `https://...` | Internet | Produção (qualquer lugar) |

---

## 🎓 Entendendo IPs

### Loopback (127.0.0.1 / localhost)
- Aponta para a própria máquina
- Não é acessível pela rede
- Funciona apenas localmente

### Rede Local (192.168.x.x / 10.0.x.x)
- IP da máquina na rede WiFi/Ethernet
- Acessível por outros dispositivos na mesma rede
- Necessário para testar em celular físico

### Público (Domínio / IP Público)
- Acessível pela internet
- Requer servidor configurado
- Usado em produção

---

## ✅ Checklist para Celular Físico

1. [ ] Descobri o IP da minha máquina (`ipconfig` / `ifconfig`)
2. [ ] Configurei o IP em `src/config/api.ts`
3. [ ] Larvel rodando com `--host=0.0.0.0`
4. [ ] Firewall permitindo porta 8000
5. [ ] Computador e celular na mesma rede WiFi
6. [ ] Testei a URL no navegador do celular
7. [ ] Expo Go instalado no celular
8. [ ] QR Code escaneado no Expo Go

---

## 🚀 Comandos Rápidos

### Setup Completo para Celular Físico

**PowerShell (Windows) - Terminal 1:**
```powershell
# 1. Descubra seu IP
ipconfig | Select-String "IPv4"

# 2. Configure firewall (Admin)
netsh advfirewall firewall add rule name="Laravel" dir=in action=allow protocol=TCP localport=8000

# 3. Inicie Laravel
php artisan serve --host=0.0.0.0
```

**PowerShell - Terminal 2:**
```powershell
# 4. Inicie Expo
npm start
```

**No Celular:**
1. Abra o Expo Go
2. Escaneie o QR Code
3. Aguarde o app carregar

---

## 💡 Dicas

### Dica 1: Use Variáveis de Ambiente
Crie `.env.local` com seu IP:
```env
REACT_APP_API_URL=http://192.168.1.100:8000/api
```

### Dica 2: Script para Descobrir IP (Windows)
```powershell
# Salve como: get-ip.ps1
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi").IPAddress
Write-Host "Seu IP: $ip"
Write-Host "URL da API: http://${ip}:8000/api"
```

Execute:
```powershell
.\get-ip.ps1
```

### Dica 3: Teste Rápido de Conectividade
```bash
# No celular, abra o navegador:
http://SEU_IP:8000/api/aluno/login

# Deve retornar erro de validação (esperado!)
# Isso confirma que a API está acessível
```

---

## 🆘 Ainda com Problemas?

1. ✅ Verifique os logs do Laravel: `storage/logs/laravel.log`
2. ✅ Teste no Postman do celular (se disponível)
3. ✅ Desabilite temporariamente o firewall para testar
4. ✅ Use o IP em vez de hostname
5. ✅ Confirme que ambos estão na mesma rede WiFi

---

**Resumo:** 
- 💻 **Emulador/Navegador:** Use `127.0.0.1` ou `localhost`
- 📱 **Celular Físico:** Use IP da rede local (`192.168.x.x`)
- ☁️ **Produção:** Funciona de qualquer lugar!

---

**Última atualização:** Janeiro 2026
