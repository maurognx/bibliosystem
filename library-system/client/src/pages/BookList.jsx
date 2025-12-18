import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Search, Printer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Erro ao buscar livros', error);
            alert('Erro ao carregar livros. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este livro?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks(); // Refresh list
            } catch (error) {
                alert('Erro ao remover livro.');
            }
        }
    };

    // Simple client-side search
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm)
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Livros</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gerencie o acervo da biblioteca</p>
                </div>
                <Link to="/books/new" className="btn btn-primary">
                    <Plus size={20} /> Novo Livro
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-control"
                            placeholder="Buscar por título, autor ou ISBN..."
                            style={{ paddingLeft: '2.5rem', width: '100%' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>ISBN</th>
                                <th>Editora</th>
                                <th>Categoria</th>
                                <th>Qtd</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td></tr>
                            ) : filteredBooks.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum livro encontrado.</td></tr>
                            ) : (
                                filteredBooks.map(book => (
                                    <tr key={book.id}>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: book.active ? '#dcfce7' : '#fee2e2',
                                                color: book.active ? '#166534' : '#991b1b'
                                            }}>
                                                {book.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.isbn || '-'}</td>
                                        <td>{book.publisher_name || '-'}</td>
                                        <td>{book.category_name || '-'}</td>
                                        <td>{book.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <Link to={`/books/label/${book.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} title="Imprimir Etiqueta">
                                                    <Printer size={16} />
                                                </Link>
                                                <Link to={`/books/edit/${book.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)', borderColor: '#fee2e2' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
