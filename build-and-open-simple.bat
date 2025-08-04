@echo off
echo 🚀 Build e Abertura Rapida
echo.

echo 🔨 Fazendo build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

echo ✅ Build concluido!
echo.

echo 🌐 Abrindo arquivo HTML...
start "" "dist/index.html"

echo ✅ Pronto! Aplicacao aberta no navegador.
pause 