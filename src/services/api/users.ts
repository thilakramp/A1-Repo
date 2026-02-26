import type { User } from '../../types';
import { MOCK_USERS } from '../../context/AuthContext';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let usersMockCache = Object.values(MOCK_USERS).map(u => ({
    ...u,
    createdAt: new Date().toISOString(),
    phone: '',
    emergencyContact: '',
    designation: u.role !== 'Client' ? `${u.role} Professional` : '',
    documents: [],
    defaultPassword: 'password123',
    whatsappNotified: false,
    emailNotified: false
})) as User[];

class UserService {
    async getUsers(): Promise<User[]> {
        await delay(300);
        return [...usersMockCache];
    }

    async createUser(data: Omit<User, 'id'>, notifyEmail: boolean, notifyWhatsapp: boolean): Promise<User> {
        await delay(400);
        const newUser: User = {
            ...data,
            id: `usr-${Date.now()}`,
            createdAt: new Date().toISOString(),
            emailNotified: notifyEmail,
            whatsappNotified: notifyWhatsapp,
        };
        usersMockCache.push(newUser);

        if (notifyEmail) {
            console.log(`Sending Welcome Email to ${newUser.email} with default password: ${newUser.defaultPassword}`);
        }
        if (notifyWhatsapp && newUser.phone) {
            console.log(`Sending Welcome WhatsApp to ${newUser.phone}`);
        }

        return newUser;
    }

    async updateUser(id: string, updates: Partial<User>): Promise<User> {
        await delay(300);
        const idx = usersMockCache.findIndex(u => u.id === id);
        if (idx === -1) throw new Error("User not found");

        usersMockCache[idx] = { ...usersMockCache[idx], ...updates };
        return usersMockCache[idx];
    }

    async deleteUser(id: string): Promise<void> {
        await delay(300);
        usersMockCache = usersMockCache.filter(u => u.id !== id);
    }
}

export const usersApi = new UserService();
