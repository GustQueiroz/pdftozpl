Write-Host "🚀 Iniciando build da aplicacao..." -ForegroundColor Green
Write-Host ""


if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependencias" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "🔨 Fazendo build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "✅ Build concluido com sucesso!" -ForegroundColor Green
Write-Host ""

Write-Host "Escolha o modo de abertura:" -ForegroundColor Cyan
Write-Host "1. Servidor de preview (recomendado)" -ForegroundColor White
Write-Host "2. Arquivo HTML direto" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite 1 ou 2"

if ($choice -eq "1") {
    Write-Host "🌐 Abrindo servidor de preview..." -ForegroundColor Yellow
    Start-Process "http://localhost:4173"
    Write-Host "📁 Iniciando servidor..." -ForegroundColor Yellow
    npm run preview
} elseif ($choice -eq "2") {
    Write-Host "🌐 Abrindo arquivo HTML..." -ForegroundColor Yellow
    Start-Process "dist/index.html"
    Write-Host "✅ Arquivo aberto no navegador!" -ForegroundColor Green
} else {
    Write-Host "❌ Opção inválida" -ForegroundColor Red
}

Read-Host "Pressione Enter para sair" 