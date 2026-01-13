# 🚀 Guia Rápido - Trocar Ambiente

## ⚡ Método Rápido (Recomendado)

### 1️⃣ Abra o arquivo:
```
src/config/api.ts
```

### 2️⃣ Altere a linha 6:

**Para Local 💻:**
```typescript
const USE_PRODUCTION = false;
```

**Para Produção ☁️:**
```typescript
const USE_PRODUCTION = true;
```

### 3️⃣ Salve e reinicie o app!

---

## 📍 URLs Configuradas

### Local
```
http://127.0.0.1:8000/api
```
✅ Use para desenvolvimento
✅ Requer Laravel rodando localmente (`php artisan serve`)

### Produção
```
https://powerfitacademy.com.br/api
```
✅ Use para testes finais
✅ Use para build de produção

---

## 🔍 Como Verificar o Ambiente Atual

Olhe no console do app quando iniciar:

**Local:**
```
🔧 Ambiente: 💻 LOCAL
🌐 URL: http://127.0.0.1:8000/api
```

**Produção:**
```
🔧 Ambiente: ☁️ PRODUÇÃO
🌐 URL: https://powerfitacademy.com.br/api
```

---

## ⚠️ IMPORTANTE

- 💻 **Sempre use LOCAL ao desenvolver**
- ☁️ **Use PRODUÇÃO apenas para testes finais**
- 🔄 **Lembre de reiniciar o app após trocar**
- 📝 **Nunca commite com USE_PRODUCTION = true**

---

## 🆘 Problemas?

Veja: [docs/ENVIRONMENTS.md](./ENVIRONMENTS.md)
