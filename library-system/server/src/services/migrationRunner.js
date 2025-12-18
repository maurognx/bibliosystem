const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
    console.log('🔄 Verificando migrações...');

    const connection = await pool.getConnection();

    try {
        // 1. Criar tabela de controle de migrações se não existir
        await connection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Ler arquivos da pasta de migrações
        const migrationsDir = path.join(__dirname, '../migrations');
        if (!fs.existsSync(migrationsDir)) {
            console.log('📂 Pasta de migrações não encontrada, criando...');
            fs.mkdirSync(migrationsDir, { recursive: true });
            return;
        }

        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        // 3. Verificar quais já foram executadas
        const [rows] = await connection.query('SELECT name FROM _migrations');
        const executedMigrations = new Set(rows.map(row => row.name));

        // 4. Executar novas migrações
        for (const file of files) {
            if (!executedMigrations.has(file)) {
                console.log(`▶️ Executando migração: ${file}`);

                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                // Suporte para múltiplos statements (split por ;)
                // Nota: Isso é um parser simples. Para procedures complexas, precisaria de algo mais robusto.
                const statements = sql
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                await connection.beginTransaction();

                try {
                    for (const statement of statements) {
                        await connection.query(statement);
                    }

                    await connection.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
                    await connection.commit();
                    console.log(`✅ Migração ${file} concluída.`);
                } catch (err) {
                    await connection.rollback();
                    console.error(`❌ Falha na migração ${file}:`, err);
                    throw err;
                }
            }
        }

        console.log('✨ Todas as migrações estão atualizadas.');

    } catch (error) {
        console.error('❌ Erro crítico nas migrações:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
}

module.exports = runMigrations;
