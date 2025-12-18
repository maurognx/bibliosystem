const pool = require('../config/db');

exports.getAll = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM publishers ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar editoras.' });
    } finally {
        connection.release();
    }
};

exports.create = async (req, res) => {
    const { name } = req.body;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('INSERT INTO publishers (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar editora.' });
    } finally {
        connection.release();
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.query('DELETE FROM publishers WHERE id = ?', [id]);
        res.json({ message: 'Editora removida.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover editora (pode estar em uso).' });
    } finally {
        connection.release();
    }
};
