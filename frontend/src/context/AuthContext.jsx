import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data.data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        // If the API returns the user object in login response, use it.
        // Based on my backend code: 
        // successResponse(res, { token }, 'Login successful'); 
        // Wait, my backend login ONLY returns token in data. It doesn't return the user object directly in data.
        // I should fetch the user details after login or update backend.
        // I'll fetch it for now to be safe.
        const meResponse = await api.get('/auth/me');
        setUser(meResponse.data.data);
        return meResponse.data.data;
    };

    const signup = async (fullName, email, password) => {
        const response = await api.post('/auth/signup', { fullName, email, password });
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        const meResponse = await api.get('/auth/me');
        setUser(meResponse.data.data);
        return meResponse.data.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
