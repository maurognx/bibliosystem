import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

export default function BookForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        quantity: 1,
        observations: '',
        active: true,
        acquisition_date: new Date().toISOString().split('T')[0], // Default today
        publisher_id: '',
        category_id: ''
    });
    const [cover, setCover] = useState(null); // File state

    const [publishers, setPublishers] = useState([]); // Placeholder for when we have Publisher CRUD
    const [categories, setCategories] = useState([]); // Placeholder for when we have Category CRUD
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        // Fetch dependencies and settings
        Promise.all([
            api.get('/publishers'),
            api.get('/categories'),
            api.get('/settings')
        ]).then(([pubRes, catRes, setRes]) => {
            setPublishers(pubRes.data);
            setCategories(catRes.data);
            setBaseUrl((setRes.data.app_base_url || '').replace(/\/$/, ''));
        }).catch(err => console.error("Erro ao carregar dependências", err));

        if (isEditing) {
            api.get(`/books/${id}`)
                .then(res => {
                    // Format date for input type="date"
                    const data = res.data;
                    if (data.acquisition_date) {
                        // Take the YYYY-MM-DD part directly from the ISO string
                        // This assumes the backend sends ISO 8601 (e.g., 2023-10-10T00:00:00.000Z)
                        // Note: If the backend adjusted for timezone before sending, this is safe.
                        // Ideally, we treat dates as strings 'YYYY-MM-DD' everywhere.
                        if (typeof data.acquisition_date === 'string') {
                            data.acquisition_date = data.acquisition_date.substring(0, 10);
                        }
                    }
                    setFormData(data);
                })
                .catch(err => alert('Erro ao carregar livro'));
        }
    }, [id, isEditing]);

    // Handle Text Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle File Change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCover(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare FormData explicitly to avoid any ambiguity
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('isbn', formData.isbn || '');
        data.append('quantity', formData.quantity);
        data.append('observations', formData.observations || '');

        // Explicitly handle boolean as string 'true'/'false'
        data.append('active', formData.active ? 'true' : 'false');

        // Date is already in YYYY-MM-DD string from input, send as is
        data.append('acquisition_date', formData.acquisition_date);

        data.append('publisher_id', formData.publisher_id || '');
        data.append('category_id', formData.category_id || '');

        if (cover) {
            data.append('cover', cover);
        }

        try {
            // No custom headers needed, Axios + Browser handles multipart/form-data
            if (isEditing) {
                await api.put(`/books/${id}`, data);
            } else {
                await api.post('/books', data);
            }
            navigate('/books');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar livro.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link to="/books" className="btn btn-outline" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {isEditing ? 'Editar Livro' : 'Novo Livro'}
                    </h1>
                </div>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label>Título do Livro *</label>
                            <input name="title" className="input-control" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 1' }}>
                            <label>Autor *</label>
                            <input name="author" className="input-control" value={formData.author} onChange={handleChange} required />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 1' }}>
                            <label>ISBN</label>
                            <input name="isbn" className="input-control" value={formData.isbn} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Data de Aquisição</label>
                            <input type="date" name="acquisition_date" className="input-control" value={formData.acquisition_date} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Quantidade</label>
                            <input type="number" name="quantity" className="input-control" value={formData.quantity} onChange={handleChange} min="0" />
                        </div>

                        {/* 
                  TODO: When Publisher/Category CRUDs are ready, populate these selects 
                  For now they will save NULL if left empty
                */}
                        <div className="input-group">
                            <label>Editora</label>
                            <select name="publisher_id" className="input-control" value={formData.publisher_id} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Categoria</label>
                            <select name="category_id" className="input-control" value={formData.category_id} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label>Capa do Livro (Imagem)</label>
                            {formData.cover_path && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <img
                                        src={baseUrl ? `${baseUrl}/uploads/${formData.cover_path}` : `/uploads/${formData.cover_path}`}
                                        alt="Capa Atual"
                                        style={{ height: '150px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capa atual</div>
                                </div>
                            )}
                            <input
                                type="file"
                                className="input-control"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label>Observações</label>
                            <textarea
                                name="observations"
                                className="input-control"
                                rows="3"
                                value={formData.observations}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                style={{ width: '1.25rem', height: '1.25rem' }}
                            />
                            <label htmlFor="active" style={{ cursor: 'pointer' }}>Livro Ativo / Disponível</label>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Link to="/books" className="btn btn-outline">Cancelar</Link>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} /> Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
