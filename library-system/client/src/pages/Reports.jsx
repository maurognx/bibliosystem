import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Filter, Printer } from 'lucide-react';

export default function Reports() {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        publisher_id: '',
        category_id: '',
        active: ''
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Load dropdowns
        api.get('/publishers').then(res => setPublishers(res.data));
        api.get('/categories').then(res => setCategories(res.data));
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
            const res = await api.get(`/books/report?${params}`);
            setResults(res.data);
        } catch (error) {
            alert('Erro ao gerar relatório');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container">
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <FileText /> Relatórios Gerenciais
                </h1>
                {results.length > 0 && (
                    <button onClick={handlePrint} className="btn btn-outline">
                        <Printer size={18} /> Imprimir Relatório
                    </button>
                )}
            </div>

            <div className="card no-print" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={16} /> Filtros de Pesquisa
                </h3>
                <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="input-group">
                        <label>De (Aquisição)</label>
                        <input type="date" name="startDate" className="input-control" value={filters.startDate} onChange={handleFilterChange} />
                    </div>
                    <div className="input-group">
                        <label>Até (Aquisição)</label>
                        <input type="date" name="endDate" className="input-control" value={filters.endDate} onChange={handleFilterChange} />
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
                    <div className="input-group">
                        <label>Status</label>
                        <select name="active" className="input-control" value={filters.active} onChange={handleFilterChange}>
                            <option value="">Todos</option>
                            <option value="true">Ativos</option>
                            <option value="false">Inativos</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Buscar
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            <div className="card" style={{ padding: 0 }}>
                {results.length > 0 ? (
                    <>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
                            <strong>Total encontrado:</strong> {results.length} livros
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Editora</th>
                                    <th>Categoria</th>
                                    <th>Aquisição</th>
                                    <th>Qtd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(book => (
                                    <tr key={book.id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.publisher_name}</td>
                                        <td>{book.category_name}</td>
                                        <td>
                                            {book.acquisition_date ? (() => {
                                                const parts = book.acquisition_date.split('-');
                                                return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : book.acquisition_date;
                                            })() : '-'}
                                        </td>
                                        <td>{book.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {loading ? 'Pesquisando...' : 'Nenhum resultado para os filtros selecionados.'}
                    </div>
                )}
            </div>

            {/* Print CSS to hide non-printable elements */}
            <style>{`
        @media print {
            .no-print { display: none !important; }
            body { background: white; }
            .card { box-shadow: none; border: none; }
            .container { max-width: 100%; margin: 0; padding: 0; }
        }
      `}</style>
        </div>
    );
}
