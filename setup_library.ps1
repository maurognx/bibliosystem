# Script de Instalação Automatizada - Sistema de Biblioteca
# Este script cria a estrutura, instala as dependências mais recentes e verifica vulnerabilidades.

Write-Host "Iniciando instalação do Sistema de Biblioteca..." -ForegroundColor Cyan

# 1. Definir diretório raiz
$RootDir = "library-system"
if (!(Test-Path $RootDir)) {
    New-Item -ItemType Directory -Force -Path $RootDir | Out-Null
    Write-Host "Pasta '$RootDir' criada." -ForegroundColor Green
} else {
    Write-Host "Pasta '$RootDir' já existe. Atualizando instalação..." -ForegroundColor Yellow
}

Set-Location $RootDir

# 2. Configurar Backend (Server)
Write-Host "`n[1/3] Configurando Backend (Node.js + MySQL)..." -ForegroundColor Cyan
if (!(Test-Path "server")) {
    New-Item -ItemType Directory -Force -Path "server" | Out-Null
}

Set-Location server

# Inicializar package.json se não existir
if (!(Test-Path "package.json")) {
    npm init -y | Out-Null
}

# Instalar dependências (Latest)
# express: Framework web
# mysql2: Driver de banco de dados otimizado
# dotenv: Gerenciamento de variáveis de ambiente
# cors: Permite conexão do frontend
# bcrypt: Segurança de senhas
# otplib: Geração de códigos OTP (2FA)
# qrcode: Geração de imagens QR Code
Write-Host "Instalando dependências do servidor (express, mysql2, otplib, etc)..." -ForegroundColor Yellow
npm install express@latest mysql2@latest dotenv@latest cors@latest bcrypt@latest otplib@latest qrcode@latest

# Auditoria de segurança
Write-Host "Verificando vulnerabilidades no servidor..." -ForegroundColor Yellow
npm audit fix

Set-Location ..

# 3. Configurar Frontend (Client)
Write-Host "`n[2/3] Configurando Frontend (React + Vite)..." -ForegroundColor Cyan

if (!(Test-Path "client")) {
    # Cria projeto React com Vite
    Write-Host "Criando projeto React..." -ForegroundColor Yellow
    # Usando create-vite diretamente para garantir versão mais recente do template
    npm create vite@latest client -- --template react
}

Set-Location client

# Instalar dependências base
Write-Host "Instalando dependências do React..." -ForegroundColor Yellow
npm install

# Instalar bibliotecas adicionais do projeto
# lucide-react: Ícones modernos
# react-router-dom: Navegação entre páginas
# react-to-print: Impressão de etiquetas
# qrcode.react: Componente React para QR Codes
Write-Host "Instalando bibliotecas de UI e utilitários..." -ForegroundColor Yellow
npm install lucide-react@latest react-router-dom@latest react-to-print@latest qrcode.react@latest

# Auditoria de segurança frontend
Write-Host "Verificando vulnerabilidades no frontend..." -ForegroundColor Yellow
npm audit fix

Set-Location ..

Write-Host "`n[3/3] Instalação Concluída com Sucesso!" -ForegroundColor Green
Write-Host "Estrutura criada em: $(Get-Location)"
Write-Host "Para rodar o projeto, você precisará de dois terminais:"
Write-Host "1. cd library-system/server && node src/index.js"
Write-Host "2. cd library-system/client && npm run dev"
