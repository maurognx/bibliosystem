import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [qrCode, setQrCode] = useState(null);
    const [error, setError] = useState('');

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await register(name, email, password);

        if (result.success) {
            setQrCode(result.qrCodeUrl);
        } else {
            setError(result.error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-app)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Cadastrar</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Crie sua conta no BiblioSystem</p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                {!qrCode ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Nome Completo</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="input-control"
                                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Criar Conta e Gerar 2FA
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <ShieldCheck size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Conta Criada com Sucesso!</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Escaneie este código QR com seu aplicativo <strong>FreeOTP</strong> ou Google Authenticator.
                        </p>

                        <div style={{
                            border: '1px solid var(--border)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            <img src={qrCode} alt="QR Code 2FA" style={{ maxWidth: '100%' }} />
                        </div>

                        <Link to="/login" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                            Ir para Login
                        </Link>
                    </div>
                )}

                {!qrCode && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Fazer Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
