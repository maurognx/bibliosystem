const pool = require('../config/db');

exports.getAll = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    } finally {
        connection.release();
    }
};

exports.create = async (req, res) => {
    const { name } = req.body;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria.' });
    } finally {
        connection.release();
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Categoria removida.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover categoria (pode estar em uso).' });
    } finally {
        connection.release();
    }
};
