import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted user
        const savedUser = localStorage.getItem('library_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, otp) => {
        try {
            const response = await api.post('/auth/login', { email, password, otp });
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('library_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erro ao realizar login',
                requireOtp: error.response?.data?.requireOtp
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            return { success: true, qrCodeUrl: response.data.qrCodeUrl };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Erro ao cadastrar' };
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('library_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
