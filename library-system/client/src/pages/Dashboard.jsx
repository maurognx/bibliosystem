import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Book, Users, Library, Tags } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        activeBooks: 0,
        totalUsers: 0,
        totalPublishers: 0,
        totalCategories: 0
    });

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Erro ao carregar dashboard"));
    }, []);

    const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                backgroundColor: color + '20', // 20% opacity
                padding: '1rem',
                borderRadius: '50%',
                color: color
            }}>
                <Icon size={32} />
            </div>
            <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>{title}</h3>
                <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{value}</div>
                {subtext && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtext}</div>}
            </div>
        </div>
    );

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Total de Livros"
                    value={stats.totalBooks}
                    subtext={`${stats.activeBooks} disponíveis`}
                    icon={Book}
                    color="#2563eb" // Blue
                />
                <StatCard
                    title="Usuários Ativos"
                    value={stats.totalUsers}
                    icon={Users}
                    color="#16a34a" // Green
                />
                <StatCard
                    title="Editoras"
                    value={stats.totalPublishers}
                    icon={Library}
                    color="#9333ea" // Purple
                />
                <StatCard
                    title="Categorias"
                    value={stats.totalCategories}
                    icon={Tags}
                    color="#ea580c" // Orange
                />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Bem-vindo ao BiblioSystem v1.0</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                    Utilize o menu lateral para navegar entre os módulos do sistema.
                </p>
            </div>
        </div>
    );
}
