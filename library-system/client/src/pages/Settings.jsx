import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Settings as SettingsIcon, Save, Info } from 'lucide-react';

export default function Settings() {
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [baseUrl, setBaseUrl] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/settings').then(res => {
            setAllowRegistration(res.data.allow_registration === 'true');
            setBaseUrl(res.data.app_base_url || window.location.origin);
        });
    }, []);

    const handleSave = async () => {
        try {
            // Save allow_registration
            await api.post('/settings', {
                key: 'allow_registration',
                value: allowRegistration
            });
            // Save app_base_url
            await api.post('/settings', {
                key: 'app_base_url',
                value: baseUrl
            });

            setMessage('Configurações salvas com sucesso!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert('Erro ao salvar configurações.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SettingsIcon /> Configurações do Sistema
            </h1>

            {message && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    {message}
                </div>
            )}

            <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Geral
                </h3>

                <div className="input-group">
                    <label>URL Base da Aplicação (para QR Code)</label>
                    <input
                        type="text"
                        className="input-control"
                        value={baseUrl}
                        onChange={e => setBaseUrl(e.target.value)}
                        placeholder="Ex: http://192.168.1.10:5173"
                    />
                    <small style={{ color: 'var(--text-muted)' }}>
                        Use o IP da rede local para que os celulares consigam abrir o link.
                    </small>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Controle de Acesso
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <strong style={{ display: 'block' }}>Permitir novos cadastros?</strong>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Se desativado, o botão "Criar Conta" será ocultado na tela de login.
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={allowRegistration}
                            onChange={e => setAllowRegistration(e.target.checked)}
                            style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
                        />
                        <span>{allowRegistration ? 'Sim' : 'Não'}</span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSave} className="btn btn-primary">
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
