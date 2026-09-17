import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('spectracheck_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Demo Fallback: If we stored the mock token, bypass backend verification
      if (token === 'mock-jwt-token-12345') {
        const storedUserJson = localStorage.getItem('spectracheck_mock_user');
        if (storedUserJson) {
          try {
            setUser(JSON.parse(storedUserJson));
          } catch (e) {
            setUser({ id: 'mock-user-123', name: 'Demo User', email: 'demo@example.com', role: 'CONSUMER' });
          }
        } else {
          setUser({ id: 'mock-user-123', name: 'Demo User', email: 'demo@example.com', role: 'CONSUMER' });
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.warn('Session expired or invalid. Logging out.');
        localStorage.removeItem('spectracheck_token');
        setUser(null);
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate, location.pathname]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('spectracheck_token', token);
    if (token === 'mock-jwt-token-12345') {
      localStorage.setItem('spectracheck_mock_user', JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('spectracheck_token');
    localStorage.removeItem('spectracheck_mock_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
