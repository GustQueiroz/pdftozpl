@echo off
echo 🚀 Iniciando build da aplicacao...
echo.

echo 📦 Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)

echo 🔨 Fazendo build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

echo ✅ Build concluido com sucesso!
echo.

echo 🌐 Abrindo no navegador...
start "" "http://localhost:4173"

echo 📁 Iniciando servidor de preview...
npm run preview

pause 