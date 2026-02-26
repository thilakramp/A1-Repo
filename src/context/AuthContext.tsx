/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for testing RBAC
export const MOCK_USERS: Record<string, User> = {
    'admin@a1media.com': { id: '1', tenantId: 'tenant-a1', name: 'Admin User', email: 'admin@a1media.com', role: 'Admin' },
    'manager@a1media.com': { id: '2', tenantId: 'tenant-a1', name: 'Manager User', email: 'manager@a1media.com', role: 'Manager' },
    'photo@a1media.com': { id: '3', tenantId: 'tenant-a1', name: 'Photo User', email: 'photo@a1media.com', role: 'Photographer' },
    'client@dummy.com': { id: '4', tenantId: 'tenant-a1', name: 'Client User', email: 'client@dummy.com', role: 'Client' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const foundUser = Object.values(MOCK_USERS).find(u => u.id === storedUserId);
            return foundUser || null;
        }
        return null;
    });
    const isLoading = false;

    const login = async (email: string, _password: string) => {
        // Simulate API call
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                const mockUser = MOCK_USERS[email];
                if (mockUser && _password === 'password') { // Simplified auth
                    setUser(mockUser);
                    localStorage.setItem('userId', mockUser.id);
                    resolve();
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
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
