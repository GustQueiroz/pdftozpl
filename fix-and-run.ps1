Write-Host "🚀 PDF para ZPL Converter - Fix e Execucao" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Verificando Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Baixe e instale o Node.js em: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "   Versão recomendada: 18.x ou superior" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green

$version = $nodeVersion -replace 'v', ''
$majorVersion = [int]($version.Split('.')[0])
if ($majorVersion -lt 16) {
    Write-Host "⚠️  Versão do Node.js muito antiga!" -ForegroundColor Yellow
    Write-Host "   Recomendado: Node.js 18.x ou superior" -ForegroundColor Yellow
    Write-Host "   Versão atual: $version" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "🧹 Limpando cache e node_modules..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ node_modules removido" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
    Write-Host "✅ package-lock.json removido" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Tentando com cache limpo..." -ForegroundColor Yellow
    npm cache clean --force
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro persistente na instalação" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Verificando arquivo .env..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Criando arquivo .env de exemplo..." -ForegroundColor Cyan
    "VITE_API_KEY=sua_api_key_aqui" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edite o arquivo .env e adicione sua API key!" -ForegroundColor Red
    Write-Host "   Exemplo: VITE_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..." -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
}

Write-Host ""
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 A aplicação estará disponível em: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 Pressione Ctrl+C para parar o servidor" -ForegroundColor Cyan
Write-Host ""

npm run dev 