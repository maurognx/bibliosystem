import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api'; // We might need a public endpoint or authentication bypass for this
import { Book, Calendar, User, Info } from 'lucide-react';

export default function PublicBook() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        // Fetch Settings (Base URL)
        api.get('/settings').then(res => {
            // Remove trailing slash if present
            const url = (res.data.app_base_url || '').replace(/\/$/, '');
            setBaseUrl(url);
        }).catch(err => console.error(err));

        // Fetch Book
        api.get(`/books/${id}`)
            .then(res => setBook(res.data))
            .catch(err => setError('Livro não encontrado ou acesso restrito.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Carregando informações do livro...</div>;
    if (error) return <div className="container" style={{ paddingTop: '2rem', color: 'red' }}>{error}</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <Book size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{book.title}</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{book.author}</p>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>

                    {/* Cover Image */}
                    {book.cover_path && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <img
                                src={book.cover_path ? (baseUrl ? `${baseUrl}/uploads/${book.cover_path}` : `/uploads/${book.cover_path}`) : ''}
                                alt={`Capa de ${book.title}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                                <Calendar size={18} />
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Aquisição</span>
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {/* Fix: Parse string YYYY-MM-DD manually to avoid timezone issues */}
                                {book.acquisition_date ?
                                    (() => {
                                        const parts = book.acquisition_date.split('-');
                                        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : book.acquisition_date;
                                    })()
                                    : 'N/A'}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                                <Info size={18} />
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>ISBN</span>
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {book.isbn || 'N/A'}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                                <User size={18} />
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Editora</span>
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {book.publisher_name || '-'}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                                <Info size={18} />
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Categoria</span>
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {book.category_name || '-'}
                            </div>
                        </div>
                    </div>

                    {book.observations && (
                        <div style={{ padding: '1rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Observações</h3>
                            <p>{book.observations}</p>
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            backgroundColor: book.active ? '#dcfce7' : '#fee2e2',
                            color: book.active ? '#166534' : '#991b1b'
                        }}>
                            {book.active ? 'Disponível na Biblioteca' : 'Indisponível'}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Área do Bibliotecário</Link>
                </div>
            </div>
        </div>
    );
}
