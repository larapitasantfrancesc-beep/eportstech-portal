#!/bin/bash

# EportsTech Portal - Setup Script
# Automatiza la configuración inicial del proyecto

set -e

echo "🚀 Iniciando setup de EportsTech Portal..."
echo ""

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo "❌ npm no encontrado. Por favor instala Node.js"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Instalando dependencias..."
npm install

# Setup environment
echo ""
echo "⚙️ Configurando variables de entorno..."

if [ -f .env.local ]; then
    echo "⚠️ .env.local ya existe. Saltando creación..."
else
    cp .env.example .env.local
    echo "✓ Archivo .env.local creado desde .env.example"
    echo "  ⚠️ Asegúrate de editar .env.local con tus credenciales"
fi

# Init git (if not already)
if [ ! -d .git ]; then
    echo ""
    echo "📝 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit from AI Studio"
    echo "✓ Repositorio inicializado"
fi

# Final status
echo ""
echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales de Supabase y Gemini"
echo "2. Crea las tablas en Supabase usando el SQL en README.md"
echo "3. Ejecuta: npm run dev"
echo "4. Abre: http://localhost:5173"
echo ""
echo "📚 Documentación:"
echo "  - README.md - Visión general"
echo "  - CONTRIBUTING.md - Guía de contribución"
echo "  - supabase_schema.sql - Script de BD (si está disponible)"
echo ""
