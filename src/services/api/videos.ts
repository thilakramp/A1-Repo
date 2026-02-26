import type { VideoVaultEntry } from '../../types/videos';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_VAULT: VideoVaultEntry[] = [
    {
        id: 'vid-vault-1',
        title: 'Wedding Reception Raw Footage',
        projectId: 'proj-1',
        projectName: 'Sarah & John Wedding',
        clientId: 'client-1',
        clientName: 'Sarah Jenkins',
        videographerName: 'Mark (Lead Videographer)',
        editorName: 'James (Senior Editor)',
        provider: 'Local NAS',
        link: 'smb://192.168.1.100/A1Media/SarahJohn_Wedding_Raw',
        previewUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=800',
        folderSizeMb: 125000, // 125GB
        videoCount: 15,
        isAccessible: true,
        lastValidatedAt: new Date().toISOString(),
        dateOfShoot: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'vid-vault-2',
        title: 'TechPromo Final Cuts',
        projectId: 'proj-2',
        projectName: 'TechCorp Product Launch',
        clientId: 'client-2',
        clientName: 'TechCorp Inc',
        videographerName: 'Tom',
        editorName: 'Elena',
        provider: 'Google Drive',
        link: 'https://drive.google.com/drive/folders/dummy-vid-folder-id',
        previewUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
        folderSizeMb: 8500, // 8.5GB
        videoCount: 3,
        isAccessible: false,
        lastValidatedAt: new Date(Date.now() - 86400000).toISOString(),
        dateOfShoot: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

class VideoVaultService {
    async getVaultEntries(): Promise<VideoVaultEntry[]> {
        await delay(300);
        return [...MOCK_VAULT];
    }

    async createVaultEntry(data: Omit<VideoVaultEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<VideoVaultEntry> {
        await delay(400);
        const entry: VideoVaultEntry = {
            ...data,
            id: `vid-vault-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        MOCK_VAULT.unshift(entry);
        return entry;
    }

    async updateVaultEntry(id: string, updates: Partial<VideoVaultEntry>): Promise<VideoVaultEntry> {
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

    async validateVaultEntry(id: string): Promise<VideoVaultEntry> {
        await delay(800);
        const index = MOCK_VAULT.findIndex(v => v.id === id);
        if (index === -1) throw new Error("Vault entry not found");

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

export const videoVaultApi = new VideoVaultService();
