#!/bin/bash

echo "🌟 Configurando LumenKit Demo..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório demo-lumenkit"
    exit 1
fi

# Verificar se a biblioteca LumenKit está construída
if [ ! -d "../lumenkit/build" ]; then
    echo "🔨 Construindo biblioteca LumenKit..."
    cd ../lumenkit
    npm run build
    cd ../demo-lumenkit
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo "✅ Configuração concluída!"
echo ""
echo "Para executar o projeto:"
echo "  npm run dev"
echo ""
echo "Para construir para produção:"
echo "  npm run build"
echo ""
echo "O aplicativo estará disponível em http://localhost:3000"
