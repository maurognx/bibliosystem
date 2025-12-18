const mysql = require('mysql2/promise');
const net = require('net');
require('dotenv').config();

async function checkHealth() {
    console.log("🔍 Iniciando Diagnóstico do Backend...\n");

    // 0. Check Dependencies
    console.log("0️⃣  Verificando Dependências...");
    const requiredModules = ['express', 'mysql2', 'cors', 'dotenv', 'bcrypt', 'otplib', 'qrcode', 'multer'];
    const missing = [];
    for (const mod of requiredModules) {
        try {
            require.resolve(mod);
        } catch (e) {
            missing.push(mod);
        }
    }
    if (missing.length > 0) {
        console.error(`   ❌ Faltam módulos: ${missing.join(', ')}`);
        console.error("      Execute: npm install");
        process.exit(1);
    }
    console.log("   ✅ Todas as dependências instaladas!");

    // 1. Check Database
    console.log("1️⃣  Testando Conexão com MariaDB/MySQL...");
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'library_db'
        });
        console.log("   ✅ Conexão com Banco de Dados: SUCESSO!");
        await connection.end();
    } catch (error) {
        console.error("   ❌ FALHA no Banco de Dados:");
        console.error(`      Erro: ${error.message}`);
        console.error("      Verifique se o MariaDB está rodando e se as credenciais no .env estão corretas.");
        process.exit(1);
    }

    // 2. Check Port 3000
    console.log("\n2️⃣  Testando Porta 3000 (Onde o servidor deve rodar)...");
    const server = net.createServer();

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log("   ⚠️  A porta 3000 já está em uso.");
            console.log("      Isso é BOM se for o seu servidor rodando!");
            console.log("      Se você não rodou o servidor, então outra coisa está ocupando a porta.");
        } else {
            console.error("   ❌ Erro ao testar porta:", err.message);
        }
    });

    server.once('listening', () => {
        console.log("   ℹ️  A porta 3000 está LIVRE.");
        console.log("      Isso significa que o servidor NÃO está rodando.");
        console.log("      Você precisa iniciar o backend (npm start ou pm2 start).");
        server.close();
    });

    server.listen(3000);
}

checkHealth();
