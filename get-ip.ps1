# ====================================
# 🔍 Descobrir IP da Máquina
# ====================================

Write-Host ""
Write-Host "🔍 Buscando IP da máquina..." -ForegroundColor Cyan
Write-Host ""

# Tentar pegar IP do WiFi
$wifiIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue).IPAddress

# Tentar pegar IP do Ethernet
$ethIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet" -ErrorAction SilentlyContinue).IPAddress

# Mostrar resultados
if ($wifiIP) {
    Write-Host "📶 WiFi:" -ForegroundColor Green
    Write-Host "   IP: $wifiIP" -ForegroundColor Yellow
    Write-Host "   URL da API: http://${wifiIP}:8000/api" -ForegroundColor Yellow
    Write-Host ""
}

if ($ethIP) {
    Write-Host "🔌 Ethernet:" -ForegroundColor Green
    Write-Host "   IP: $ethIP" -ForegroundColor Yellow
    Write-Host "   URL da API: http://${ethIP}:8000/api" -ForegroundColor Yellow
    Write-Host ""
}

if (-not $wifiIP -and -not $ethIP) {
    Write-Host "❌ Nenhuma conexão de rede encontrada!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Todas as interfaces:" -ForegroundColor Yellow
    Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -ne "127.0.0.1"} | Format-Table InterfaceAlias, IPAddress -AutoSize
}

Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Copie o IP acima" -ForegroundColor White
Write-Host "2. Abra: src/config/api.ts" -ForegroundColor White
Write-Host "3. Cole o IP em: LOCAL_URLS.physical" -ForegroundColor White
Write-Host "4. Altere: local: LOCAL_URLS.physical" -ForegroundColor White
Write-Host ""
Write-Host "💡 Comando para iniciar Laravel:" -ForegroundColor Cyan
Write-Host "   php artisan serve --host=0.0.0.0" -ForegroundColor Yellow
Write-Host ""
