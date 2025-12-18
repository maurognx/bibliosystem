const pool = require('../config/db');

// Get all settings (or specific ones we expose)
exports.getSettings = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM system_settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar configurações.' });
    } finally {
        connection.release();
    }
};

// Update a specific setting
exports.updateSetting = async (req, res) => {
    const { key, value } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [key, String(value), String(value)]
        );
        res.json({ message: 'Configuração atualizada.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar configuração.' });
    } finally {
        connection.release();
    }
};

// Check registration status (Public endpoint helper)
exports.checkRegistrationStatus = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query("SELECT setting_value FROM system_settings WHERE setting_key = 'allow_registration'");
        const allowed = rows.length > 0 ? rows[0].setting_value === 'true' : true; // Default true if missing
        res.json({ allowed });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar status.' });
    } finally {
        connection.release();
    }
};
