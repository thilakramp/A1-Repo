import type { PhotoVaultEntry } from '../../types/photos';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_VAULT: PhotoVaultEntry[] = [
    {
        id: 'vault-1',
        title: 'Pre-Wedding Shoot',
        projectId: 'proj-1',
        projectName: 'Sarah & John Wedding',
        clientId: 'client-1',
        clientName: 'Sarah Jenkins',
        photographerName: 'Alex (Lead Photographer)',
        editorName: 'Mike (Senior Editor)',
        provider: 'Google Drive',
        link: 'https://drive.google.com/drive/folders/dummy-folder-id',
        previewUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
        folderSizeMb: 12500, // 12.5GB
        photoCount: 850,
        isAccessible: true,
        lastValidatedAt: new Date().toISOString(),
        dateOfShoot: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'vault-2',
        title: 'TechCorp Q3 Event',
        projectId: 'proj-2',
        projectName: 'TechCorp Product Launch',
        clientId: 'client-2',
        clientName: 'TechCorp Inc',
        photographerName: 'Chris',
        editorName: 'Lisa',
        provider: 'Local NAS',
        link: 'smb://192.168.1.100/A1Media/TechCorp_Q3_Event',
        previewUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        folderSizeMb: 4500, // 4.5GB
        photoCount: 320,
        isAccessible: false,
        lastValidatedAt: new Date(Date.now() - 86400000).toISOString(),
        dateOfShoot: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

class PhotoVaultService {
    async getVaultEntries(): Promise<PhotoVaultEntry[]> {
        await delay(300);
        return [...MOCK_VAULT];
    }

    async createVaultEntry(data: Omit<PhotoVaultEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<PhotoVaultEntry> {
        await delay(400);
        const entry: PhotoVaultEntry = {
            ...data,
            id: `vault-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        MOCK_VAULT.unshift(entry);
        return entry;
    }

    async updateVaultEntry(id: string, updates: Partial<PhotoVaultEntry>): Promise<PhotoVaultEntry> {
        await delay(300);
        const index = MOCK_VAULT.findIndex(v => v.id === id);
        if (index === -1) throw new Error("Vault entry not found");

        const updated = {
            ...MOCK_VAULT[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        MOCK_VAULT[index] = updated;
        return updated;
    }

    async deleteVaultEntry(id: string): Promise<void> {
        await delay(300);
        const index = MOCK_VAULT.findIndex(v => v.id === id);
        if (index > -1) MOCK_VAULT.splice(index, 1);
    }

    async validateVaultEntry(id: string): Promise<PhotoVaultEntry> {
        await delay(800);
        const index = MOCK_VAULT.findIndex(v => v.id === id);
        if (index === -1) throw new Error("Vault entry not found");

        // Mock: 90% chance it succeeds
        const isValid = Math.random() > 0.1;

        const updated = {
            ...MOCK_VAULT[index],
            isAccessible: isValid,
            lastValidatedAt: new Date().toISOString()
        };
        MOCK_VAULT[index] = updated;
        return updated;
    }
}

export const photoVaultApi = new PhotoVaultService();
