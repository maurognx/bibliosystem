# Sistema de Biblioteca (BiblioSystem)

Sistema de gerenciamento de biblioteca Full Stack com suporte a impressão de etiquetas, busca pública e dashboards.

## 🚀 Funcionalidades
- **Gestão de Acervo**: Livros, Editoras e Categorias.
- **Consulta Pública**: Interface de busca para visitantes sem login.
- **Gestão de Usuários**: Login seguro e suporte a MFA/OTP.
- **Etiquetas**: Geração de etiquetas com QR Code para lombada de livros.
- **Relatórios**: Filtros avançados por data de aquisição, editora e status.
- **Upload de Capas**: Suporte a envio de imagens para os livros.

## 📦 Estrutura do Projeto
- `client/`: Frontend em React (Vite).
- `server/`: Backend em Node.js (Express) + MySQL.

## 🛠️ Instalação (Ambiente Linux / LXC)

### Opção 1: Instalação Automática (Recomendada)
Utilize o script `setup_lxc.sh` fornecido na raiz.

1.  Copie a pasta `library-system` para o servidor (ex: `/root` ou `/var/www`).
2.  Copie o arquivo `setup_lxc.sh` para o mesmo diretório pai.
3.  Dê permissão de execução e rode:
    ```bash
    chmod +x setup_lxc.sh
    ./setup_lxc.sh
    ```
    *Este script instala Node.js, MariaDB (MySQL), PM2, e configura o banco de dados e dependências.*

### Opção 2: Instalação Manual

**1. Pré-requisitos**
- Node.js > 20
- MySQL ou MariaDB

**2. Backend**
```bash
cd library-system/server
# Cria o arquivo .env (edite com sua senha do banco)
cp .env.example .env 
npm install
npm install multer # Garante dependências críticas
node src/index.js # Roda migrações e inicia
```

**3. Frontend**
```bash
cd library-system/client
npm install
npm run build # Gera a pasta 'dist'
```

## ⚙️ Configuração
O sistema usa um arquivo `.env` no diretório `server`.
Exemplo:
```ini
DB_HOST=localhost
DB_USER=library_user
DB_PASSWORD=secure_password_123
DB_NAME=library_db
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

## ▶️ Como Rodar em Produção
O backend já serve os arquivos estáticos do frontend (pasta `client/dist`).

Na pasta `server`:
```bash
# Iniciar com PM2 (Process Manager)
pm2 start src/index.js --name library-api || pm2 restart library-api

# Salvar lista de processos para iniciar no boot
pm2 save
pm2 startup
```

Acesse via navegador: `http://SEU_IP:3000`

## 🐛 Solução de Problemas Comuns
- **Imagens não carregam**: Verifique se a pasta `server/uploads` existe. O script de setup deve criá-la.
- **Datas Erradas**: O sistema usa `dateStrings: true` no MySQL. Se datas aparecerem com um dia a menos, verifique se o frontend e backend foram reiniciados após a última atualização.
