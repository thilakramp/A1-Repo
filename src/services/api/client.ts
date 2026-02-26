import type { Client } from '../../types/client';

export let MOCK_CLIENTS: Client[] = [
    {
        id: 'client-1',
        name: 'Sarah Jenkins',
        phone: '+1 555-0198',
        email: 'sarah.j@techstart.io',
        company: 'TechStart',
        socials: { linkedin: 'linkedin.com/in/sjenkins' },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'client-2',
        name: 'Michael Chang',
        phone: '+1 555-0234',
        email: 'm.chang@designco.com',
        company: 'Design Co',
        socials: { instagram: '@mikechang_design' },
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'client-3',
        name: 'Emma Watson',
        phone: '+1 555-0912',
        email: 'emma@bloomfloral.com',
        company: 'Bloom Floral',
        socials: {},
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ClientService {
    async getClients(): Promise<Client[]> {
        await delay(300);
        return [...MOCK_CLIENTS];
    }

    async getClient(id: string): Promise<Client | undefined> {
        await delay(100);
        return MOCK_CLIENTS.find(c => c.id === id);
    }

    async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
        await delay(300);
        const newClient: Client = {
            ...clientData,
            id: `client-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        MOCK_CLIENTS.push(newClient);
        return newClient;
    }

    async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
        await delay(300);
        const index = MOCK_CLIENTS.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Client not found');

        const updatedClient = {
            ...MOCK_CLIENTS[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        MOCK_CLIENTS[index] = updatedClient;
        return updatedClient;
    }

    async deleteClient(id: string): Promise<void> {
        await delay(300);
        MOCK_CLIENTS = MOCK_CLIENTS.filter(c => c.id !== id);
    }
}

export const clientApi = new ClientService();
