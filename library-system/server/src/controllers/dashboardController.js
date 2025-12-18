const pool = require('../config/db');

exports.getStats = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [[{ totalBooks }]] = await connection.query('SELECT COUNT(*) as totalBooks FROM books');
        const [[{ activeBooks }]] = await connection.query('SELECT COUNT(*) as activeBooks FROM books WHERE active = 1');
        const [[{ totalUsers }]] = await connection.query('SELECT COUNT(*) as totalUsers FROM users');
        const [[{ totalPublishers }]] = await connection.query('SELECT COUNT(*) as totalPublishers FROM publishers');
        const [[{ totalCategories }]] = await connection.query('SELECT COUNT(*) as totalCategories FROM categories');

        res.json({
            totalBooks,
            activeBooks,
            totalUsers,
            totalPublishers,
            totalCategories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
    } finally {
        connection.release();
    }
};
