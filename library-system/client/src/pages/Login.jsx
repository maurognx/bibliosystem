import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if registration is allowed
        // We use a direct fetch or a separate axios call to avoid issues if the main api interceptor is strict/complex
        // But since we have a public route, we can try to use api.
        api.get('/settings/public/registration-status')
            .then(res => setShowRegister(res.data.allowed))
            .catch(() => setShowRegister(true)); // Default true on error
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password, otp);
            if (result.success) {
                navigate('/');
            } else {
                if (result.requireOtp) {
                    setShowOtpInput(true);
                    setError('Credenciais corretas. Digite o código 2FA.');
                } else {
                    setError(result.error || 'Erro ao fazer login.');
                }
            }
        } catch (err) {
            setError('Erro inesperado ao tentar logar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '1rem',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderRadius: '50%',
                        marginBottom: '1rem'
                    }}>
                        <Book size={32} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>BiblioSystem</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Entre para acessar o sistema</p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="input-control"
                                style={{ paddingLeft: '2.5rem', width: '100%' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={showOtpInput}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="input-control"
                                style={{ paddingLeft: '2.5rem', width: '100%' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={showOtpInput}
                            />
                        </div>
                    </div>

                    {showOtpInput && (
                        <div className="input-group" style={{ marginTop: '1rem', animation: 'fadeIn 0.3s ease-in' }}>
                            <label style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Código Autenticador (2FA)</label>
                            <div style={{ position: 'relative' }}>
                                <KeyRound size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="input-control"
                                    placeholder="000000"
                                    style={{ paddingLeft: '2.5rem', width: '100%', letterSpacing: '0.2rem', fontSize: '1.1rem' }}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Processando...' : (showOtpInput ? 'Confirmar Login' : 'Entrar')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
                    {showRegister && (
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            Não tem uma conta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>Cadastre-se</Link>
                        </p>
                    )}
                    <p style={{ fontSize: '0.875rem' }}>
                        <Link to="/public/search" style={{ color: 'var(--text-muted)' }}>Consulta Pública</Link>
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
