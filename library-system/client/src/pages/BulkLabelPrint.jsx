import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useReactToPrint } from 'react-to-print';
import { Printer, Filter, Tags } from 'lucide-react';
import { PrintableLabel } from '../components/PrintableLabel';

export default function BulkLabelPrint() {
    const [filters, setFilters] = useState({
        author: '',
        publisher_id: '',
        category_id: ''
    });

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [baseUrl, setBaseUrl] = useState('');

    const printRef = useRef();

    useEffect(() => {
        api.get('/publishers').then(res => setPublishers(res.data));
        api.get('/categories').then(res => setCategories(res.data));
        api.get('/settings').then(res => setBaseUrl(res.data.app_base_url));
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            // Reuse the report endpoint which now supports author filtering
            const res = await api.get(`/books/report?${params}&active=true`);
            setBooks(res.data);
        } catch (error) {
            alert('Erro ao buscar livros');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Etiquetas-Lote',
    });

    return (
        <div className="container">
            <div className="no-print" style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    <Tags /> Impressão de Etiquetas em Massa
                </h1>

                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} /> Filtros
                    </h3>
                    <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="input-group">
                            <label>Autor (Nome ou parte)</label>
                            <input
                                type="text"
                                name="author"
                                className="input-control"
                                value={filters.author}
                                onChange={handleFilterChange}
                                placeholder="Ex: Machado de Assis"
                            />
                        </div>
                        <div className="input-group">
                            <label>Editora</label>
                            <select name="publisher_id" className="input-control" value={filters.publisher_id} onChange={handleFilterChange}>
                                <option value="">Todas</option>
                                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Categoria</label>
                            <select name="category_id" className="input-control" value={filters.category_id} onChange={handleFilterChange}>
                                <option value="">Todas</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                <Filter size={16} /> Filtrar Livros
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Area */}
            {books.length > 0 && (
                <div className="no-print" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{books.length} etiquetas geradas</strong>
                    <button onClick={handlePrint} className="btn btn-primary">
                        <Printer size={20} /> Imprimir Todas
                    </button>
                </div>
            )}

            {!loading && books.length === 0 && (
                <p className="no-print" style={{ color: 'var(--text-muted)' }}>Utilize os filtros para gerar as etiquetas.</p>
            )}

            {/* Print Container - Hidden on screen via CSS if not careful, but we want to show preview */}
            {/* We will use a dedicated Grid for print */}
            <div style={{ background: '#eee', padding: '1rem', borderRadius: '8px', overflow: 'auto', maxHeight: '500px' }} className="no-print">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {books.map(book => (
                        <div key={book.id} style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '384px', height: '110px' }}>
                            <PrintableLabel book={book} baseUrl={baseUrl} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIDDEN PRINT AREA */}
            <div style={{ display: 'none' }}>
                <div ref={printRef} className="print-container">
                    {books.map(book => (
                        <div key={book.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                            <PrintableLabel book={book} baseUrl={baseUrl} />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media print {
                    .print-container {
                        display: block !important;
                    }
                    /* Ensure each label is treated as a block that tries not to split */
                    .printable-label-container {
                        break-inside: avoid;
                        page-break-inside: avoid;
                        margin-bottom: 2mm; /* Tiny space between labels on continuous roll or sheet */
                    }
                }
            `}</style>
        </div>
    );
}
