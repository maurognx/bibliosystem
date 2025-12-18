#!/bin/bash

# Script de Configuração de Ambiente para Sistema de Biblioteca (LXC/Debian/Ubuntu)
# Executar como root ou com sudo

set -e

echo -e "\033[1;36mIniciando configuração do ambiente LXC...\033[0m"

# 1. Atualizar Sistema
echo -e "\033[1;33m[1/4] Atualizando pacotes do sistema...\033[0m"
apt-get update && apt-get upgrade -y
apt-get install -y curl git unzip build-essential fontconfig

# 2. Instalar MySQL Server
echo -e "\033[1;33m[2/4] Instalando MySQL Server...\033[0m"
apt-get install -y mariadb-server mariadb-client
# Nota: Em Debian/Ubuntu, MariaDB é o drop-in replacement comum e leve para o MySQL.
# Se preferir MySQL oficial, alterar para mysql-server.

service mariadb start

# Configuração Básica do Banco
echo -e "\033[1;33m[2.1] Configurando Banco de Dados...\033[0m"
DB_NAME="library_db"
DB_USER="library_user"
DB_PASS="secure_password_123" # ALTERAR EM PRODUÇÃO

mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo "Banco '${DB_NAME}' criado e usuário '${DB_USER}' configurado."

# 3. Instalar Node.js (Latest LTS)
echo -e "\033[1;33m[3/4] Instalando Node.js (Source: NodeSource)...\033[0m"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3.1 Instalar PM2 (Process Manager)
echo -e "\033[1;33m[3.1/4] Instalando PM2 (para manter o app rodando)...\033[0m"
npm install -g pm2

# 4. Mensagem Final
echo -e "\033[1;32m[4/4] Ambiente Configurado com Sucesso!\033[0m"
echo ""

# 5. Setup do Projeto (Automação Opcional)
PROJECT_DIR="/root/biblioteca/library-system"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "\033[1;33m[5/5] Diretório do projeto encontrado! Instalando dependências...\033[0m"
    
    # Server
    if [ -d "$PROJECT_DIR/server" ]; then
        echo "Instalando dependências do Servidor..."
        cd "$PROJECT_DIR/server"
        npm install
        # Ensure multer is installed if missing from package.json (Safe fallback)
        npm install multer 
    fi

    # Client
    if [ -d "$PROJECT_DIR/client" ]; then
        echo "Instalando dependências do Cliente e Buildando..."
        cd "$PROJECT_DIR/client"
        npm install
        npm run build
    fi
    
    echo -e "\033[1;32mProjeto Pronto! Use 'pm2 start src/index.js --name library-api' na pasta server para rodar.\033[0m"
else
    echo "Agora você pode copiar os arquivos do projeto para este container."
    echo "Sugestão de passos:"
    echo "1. Copie a pasta 'library-system' para cá (ex: $PROJECT_DIR)."
    echo "2. Entre na pasta: cd library-system/server"
    echo "3. Instale deps: npm install"
    echo "4. Rode as migrações: node src/index.js"
fi

