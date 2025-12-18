import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, Plus, Library } from 'lucide-react';

export default function PublisherList() {
    const [publishers, setPublishers] = useState([]);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/publishers');
            setPublishers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await api.post('/publishers', { name: newName });
            setNewName('');
            fetchItems();
        } catch (error) {
            alert('Erro ao criar editora');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remover editora?')) return;
        try {
            await api.delete(`/publishers/${id}`);
            fetchItems();
        } catch (error) {
            alert('Não é possível remover editora em uso por livros.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Library /> Editoras
            </h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className="input-control"
                        style={{ flex: 1 }}
                        placeholder="Nome da nova editora"
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
                        {publishers.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>
                                    <button onClick={() => handleDelete(p.id)} className="btn btn-outline" style={{ color: 'var(--danger)', border: 'none' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {publishers.length === 0 && (
                            <tr><td colSpan="2" style={{ textAlign: 'center', padding: '1rem' }}>Nenhuma editora cadastrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
