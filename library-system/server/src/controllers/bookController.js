const pool = require('../config/db');

// List all books
exports.getAll = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
      SELECT b.*, p.name as publisher_name, c.name as category_name 
      FROM books b
      LEFT JOIN publishers p ON b.publisher_id = p.id
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.title ASC
    `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar livros.' });
    } finally {
        connection.release();
    }
};

// Get book by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT b.*, p.name as publisher_name, c.name as category_name 
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.id = ?
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar livro.' });
    } finally {
        connection.release();
    }
};

// Create new book
exports.create = async (req, res) => {
    const {
        title, author, isbn, quantity, observations,
        active, acquisition_date, publisher_id, category_id
    } = req.body;

    const connection = await pool.getConnection();
    try {
        const cover_path = req.file ? req.file.filename : null;
        // Parse active (FormData sends strings)
        const isActive = active === 'true' || active === true || active === 1 || active === '1';

        const [result] = await connection.query(`
      INSERT INTO books (
        title, author, isbn, quantity, observations, 
        active, acquisition_date, publisher_id, category_id, cover_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            title, author, isbn, quantity || 1, observations,
            isActive, acquisition_date,
            publisher_id || null, category_id || null, cover_path
        ]);

        res.status(201).json({
            id: result.insertId,
            message: 'Livro cadastrado com sucesso!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar livro.' });
    } finally {
        connection.release();
    }
};

// Update book
exports.update = async (req, res) => {
    const { id } = req.params;
    console.log(`[UPDATE] ID: ${id}`);
    console.log('[UPDATE] Body:', req.body);
    console.log('[UPDATE] File:', req.file);

    const {
        title, author, isbn, quantity, observations,
        active, acquisition_date, publisher_id, category_id
    } = req.body;

    const connection = await pool.getConnection();
    try {
        let sql = `
          UPDATE books SET 
            title=?, author=?, isbn=?, quantity=?, observations=?, 
            active=?, acquisition_date=?, publisher_id=?, category_id=?
        `;
        const params = [
            title, author, isbn, quantity, observations,
            active === 'true' || active === true, acquisition_date, publisher_id, category_id
        ];

        // Only update cover_path if a new file is uploaded
        if (req.file) {
            sql += `, cover_path=?`;
            params.push(req.file.filename);
        }

        sql += ` WHERE id=?`;
        params.push(id);

        await connection.query(sql, params);

        res.json({ message: 'Livro atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar livro.' });
    } finally {
        connection.release();
    }
};

// Delete book
exports.delete = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: 'Livro removido com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover livro.' });
    } finally {
        connection.release();
    }
};
// Advanced Search / Reports
exports.search = async (req, res) => {
    const { startDate, endDate, publisher_id, category_id, active } = req.query;
    const connection = await pool.getConnection();

    try {
        let sql = `
      SELECT b.*, p.name as publisher_name, c.name as category_name 
      FROM books b
      LEFT JOIN publishers p ON b.publisher_id = p.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE 1=1
    `;
        const params = [];

        if (startDate) {
            sql += ' AND b.acquisition_date >= ?';
            params.push(startDate);
        }
        if (endDate) {
            sql += ' AND b.acquisition_date <= ?';
            params.push(endDate);
        }
        if (publisher_id) {
            sql += ' AND b.publisher_id = ?';
            params.push(publisher_id);
        }
        if (category_id) {
            sql += ' AND b.category_id = ?';
            params.push(category_id);
        }
        if (req.query.author) {
            sql += ' AND b.author LIKE ?';
            params.push(`%${req.query.author}%`);
        }
        if (active !== undefined && active !== '') {
            sql += ' AND b.active = ?';
            params.push(active === 'true' ? 1 : 0);
        } // If active is empty, show all

        sql += ' ORDER BY b.acquisition_date DESC, b.title ASC';

        const [rows] = await connection.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar relatório.' });
    } finally {
        connection.release();
    }
};

// Public Global Search
exports.searchPublic = async (req, res) => {
    const { q } = req.query; // q = query term
    const connection = await pool.getConnection();

    try {
        const searchTerm = `%${q}%`;
        const sql = `
      SELECT b.*, p.name as publisher_name, c.name as category_name 
      FROM books b
      LEFT JOIN publishers p ON b.publisher_id = p.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE 
        b.title LIKE ? OR 
        b.author LIKE ? OR 
        b.isbn LIKE ? OR 
        b.observations LIKE ?
      ORDER BY b.title ASC
    `;

        const [rows] = await connection.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro na busca pública.' });
    } finally {
        connection.release();
    }
};
