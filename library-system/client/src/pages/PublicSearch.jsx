import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Book, User, Calendar, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublicSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        api.get('/settings').then(res => {
            const url = (res.data.app_base_url || '').replace(/\/$/, '');
            setBaseUrl(url);
        }).catch(err => console.error(err));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const res = await api.get(`/books/public/search?q=${query}`);
            setResults(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff' }}>
            {/* Header / Hero */}
            <header style={{ backgroundColor: 'white', padding: '2rem 1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Book size={32} color="var(--primary)" />
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>BiblioSystem</h1>
                    </div>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Consulta Pública do Acervo
                    </p>

                    <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '16px', color: '#94a3b8' }} />
                        <input
                            type="text"
                            className="input-control"
                            placeholder="Pesquise por título, autor, assunto ou observações..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            style={{ padding: '1rem 1rem 1rem 3.5rem', fontSize: '1.1rem', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                    </form>
                    <div style={{ marginTop: '1rem' }}>
                        <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Acesso Restrito (Funcionários)</Link>
                    </div>
                </div>
            </header>

            {/* Results */}
            <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Pesquisando...</div>
                ) : hasSearched && results.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum livro encontrado para "{query}".</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {results.map(book => (
                            <div key={book.id} className="card" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start' }}>
                                {/* Cover Thumb */}
                                {book.cover_path && (
                                    <div style={{ flexShrink: 0 }}>
                                        <img
                                            src={baseUrl ? `${baseUrl}/uploads/${book.cover_path}` : `/uploads/${book.cover_path}`}
                                            alt={book.title}
                                            style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                                        />
                                    </div>
                                )}

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{book.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <User size={16} /> {book.author}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                                        {book.publisher_name && <span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{book.publisher_name}</span>}
                                        {book.category_name && <span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{book.category_name}</span>}
                                    </div>

                                    {book.observations && (
                                        <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            "{book.observations}"
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            backgroundColor: book.active ? '#dcfce7' : '#fee2e2',
                                            color: book.active ? '#166534' : '#991b1b'
                                        }}>
                                            {book.active ? 'Disponível' : 'Indisponível'}
                                        </span>

                                        <Link to={`/public/books/${book.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                            Ver Detalhes <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
