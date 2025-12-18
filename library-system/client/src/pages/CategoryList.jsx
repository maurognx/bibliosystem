import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, Plus, Tags } from 'lucide-react';

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await api.post('/categories', { name: newName });
            setNewName('');
            fetchItems();
        } catch (error) {
            alert('Erro ao criar categoria');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remover categoria?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchItems();
        } catch (error) {
            alert('Não é possível remover categoria em uso por livros.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tags /> Categorias
            </h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className="input-control"
                        style={{ flex: 1 }}
                        placeholder="Nome da nova categoria"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Plus size={18} /> Adicionar
                    </button>
                </form>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>
                                    <button onClick={() => handleDelete(c.id)} className="btn btn-outline" style={{ color: 'var(--danger)', border: 'none' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan="2" style={{ textAlign: 'center', padding: '1rem' }}>Nenhuma categoria cadastrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
