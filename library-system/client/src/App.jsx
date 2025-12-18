import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Book, LayoutDashboard, Settings, Library, Tags, FileText } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import PublisherList from './pages/PublisherList';
import CategoryList from './pages/CategoryList';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import Dashboard from './pages/Dashboard';

import BookLabel from './pages/BookLabel';
import BulkLabelPrint from './pages/BulkLabelPrint';
import PublicBook from './pages/PublicBook';
import PublicSearch from './pages/PublicSearch';

// Layout Component (Sidebar + Content)
const Layout = ({ children }) => {
    const { logout } = useAuth();
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '250px', backgroundColor: '#fff', borderRight: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <Book size={24} color="var(--primary)" />
                    <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>BiblioSystem</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <Link to="/" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/books" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <Book size={18} /> Livros
                    </Link>
                    <Link to="/books/bulk-labels" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <Tags size={18} /> Imp. Etiquetas
                    </Link>
                    <Link to="/reports" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <FileText size={18} /> Relatórios
                    </Link>
                    <Link to="/publishers" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <Library size={18} /> Editoras
                    </Link>
                    <Link to="/categories" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <Tags size={18} /> Categorias
                    </Link>
                    <Link to="/settings" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
                        <Settings size={18} /> Configurações
                    </Link>
                </nav>

                <button onClick={logout} className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', marginTop: 'auto', color: 'var(--danger)' }}>
                    Sair
                </button>
            </aside>
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
};

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Carregando...</div>;

    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Routes */}
                    <Route path="/public/search" element={<PublicSearch />} />
                    <Route path="/public/books/:id" element={<PublicBook />} />

                    <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />

                    {/* Books Routes */}
                    <Route path="/books" element={<PrivateRoute><Layout><BookList /></Layout></PrivateRoute>} />
                    <Route path="/books/new" element={<PrivateRoute><Layout><BookForm /></Layout></PrivateRoute>} />
                    <Route path="/books/edit/:id" element={<PrivateRoute><Layout><BookForm /></Layout></PrivateRoute>} />
                    <Route path="/books/label/:id" element={<PrivateRoute><Layout><BookLabel /></Layout></PrivateRoute>} />
                    <Route path="/books/bulk-labels" element={<PrivateRoute><Layout><BulkLabelPrint /></Layout></PrivateRoute>} />

                    <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />

                    <Route path="/publishers" element={<PrivateRoute><Layout><PublisherList /></Layout></PrivateRoute>} />
                    <Route path="/categories" element={<PrivateRoute><Layout><CategoryList /></Layout></PrivateRoute>} />

                    <Route path="/settings" element={<PrivateRoute><Layout><SettingsPage /></Layout></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
