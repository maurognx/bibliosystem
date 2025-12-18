const express = require('express');
const cors = require('cors');
require('dotenv').config();
const runMigrations = require('./services/migrationRunner');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const path = require('path');

// ... (Routes)
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Serve Static Frontend (Production)
// Adjust path to point to client/dist relative to server/src
// Serve Static Frontend (Production)
// Adjust path to point to client/dist relative to server/src
const clientBuildPath = path.join(__dirname, '../../client/dist');
const fs = require('fs');
const pool = require('./config/db');

// SEO: Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
    try {
        const [books] = await pool.query('SELECT id, created_at FROM books WHERE active = 1');
        const [settings] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'app_base_url'");
        const baseUrl = (settings[0]?.setting_value || 'http://localhost:3000').replace(/\/$/, '');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

        books.forEach(book => {
            xml += `
  <url>
    <loc>${baseUrl}/public/books/${book.id}</loc>
    <lastmod>${new Date(book.created_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        xml += '\n</urlset>';
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating sitemap');
    }
});

// SEO: Dynamic Meta Injection for Public Books
app.get('/public/books/:id', async (req, res) => {
    const filePath = path.join(clientBuildPath, 'index.html');

    // Fallback if file doesn't exist (dev mode or build missing)
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Build not found. Please run "npm run build" in client.');
    }

    try {
        let htmlData = fs.readFileSync(filePath, 'utf8');
        const bookId = req.params.id;

        // Fetch book data
        const [rows] = await pool.query('SELECT title, author, observations FROM books WHERE id = ?', [bookId]);

        if (rows.length > 0) {
            const book = rows[0];
            const title = `${book.title} - Biblioteca`;
            const description = `Autor: ${book.author}. ${book.observations || ''}`;

            // Inject into HTML
            htmlData = htmlData
                .replace('<title>Sistema de Biblioteca</title>', `<title>${title}</title>`)
                .replace('content="Sistema de Biblioteca"', `content="${title}"`) // OG Title
                .replace('content="Sistema de Gerenciamento de Biblioteca e Consulta Pública de Acervo."', `content="${description}"`)
                .replace('content="Consulta Pública de Acervo."', `content="${description}"`); // OG Description
        }

        res.send(htmlData);
    } catch (err) {
        console.error('Error serving index.html', err);
        res.status(500).send('Server Error');
    }
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(clientBuildPath));

// Handle React Routing (SPA) - Send index.html for any other request
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start Server
async function startServer() {
    await runMigrations();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

startServer();
