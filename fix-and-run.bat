@echo off
echo 🚀 PDF para ZPL Converter - Fix e Execucao
echo ============================================
echo.

echo 📋 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo.
    echo 📥 Baixe e instale o Node.js em: https://nodejs.org/
    echo    Versao recomendada: 18.x ou superior
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

echo.
echo 🧹 Limpando cache e node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ node_modules removido
)
if exist package-lock.json (
    del package-lock.json
    echo ✅ package-lock.json removido
)

echo.
echo 📦 Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias
    echo.
    echo 🔧 Tentando com cache limpo...
    npm cache clean --force
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro persistente na instalacao
        pause
        exit /b 1
    )
)

echo.
echo 🔧 Verificando arquivo .env...
if not exist .env (
    echo ⚠️  Arquivo .env nao encontrado!
    echo.
    echo 📝 Criando arquivo .env de exemplo...
    echo VITE_API_KEY=sua_api_key_aqui > .env
    echo.
    echo ⚠️  IMPORTANTE: Edite o arquivo .env e adicione sua API key!
    echo    Exemplo: VITE_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
    echo.
    pause
)

echo.
echo 🚀 Iniciando servidor de desenvolvimento...
echo.
echo 📍 A aplicacao estara disponivel em: http://localhost:5173
echo 📍 Pressione Ctrl+C para parar o servidor
echo.

npm run dev

pause 